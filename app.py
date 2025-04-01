from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
import jwt  
from jwt import encode, decode, ExpiredSignatureError, InvalidTokenError
import datetime
import os
import joblib
import pandas as pd
import numpy as np
import re
from dotenv import load_dotenv
import warnings
from sklearn.exceptions import ConvergenceWarning
import lime
import lime.lime_tabular
import shap
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  
import base64
from io import BytesIO

# Suppress warnings
warnings.filterwarnings("ignore", category=UserWarning, module='sklearn')
warnings.filterwarnings("ignore", category=ConvergenceWarning, module='sklearn')

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", "your_default_secret_key")

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["chemrisk"]
users_collection = db["users"]

# Load models and vectorizer
vectorizer_path = os.path.abspath('tfidf_vectorizer.pkl')
print(f"Vectorizer Absolute Path: {vectorizer_path}")

try:
    vectorizer = joblib.load(vectorizer_path)
    print("✅ Vectorizer Loaded Successfully!")
except Exception as e:
    print(f"❌ Error Loading Vectorizer: {e}")

regressor = joblib.load('multi_output_regressor_model.pkl')

# Load Importer Risk Models
clf = joblib.load("gradient_boost_classifier.pkl")
reg = joblib.load("gradient_boost_regressor.pkl")
encoder = joblib.load("encoder.pkl")
scaler = joblib.load("scaler.pkl")
label_encoder = joblib.load("label_encoder.pkl")

# Load saved model, scaler, label encoder, and trained columns - Future Trends
model_future = joblib.load('nn_model.pkl')
scaler_future = joblib.load('scaler_future.pkl')
le = joblib.load('label_encoder_future.pkl')
trained_columns = joblib.load('trained_columns.pkl')

# Define Categorical and Numerical Columns
categorical_cols = ["Chemical_Name", "Country_of_Origin", "Importation_Description", "Compliance_History", "Financial_Stability"]
numerical_cols = ["Import_Frequency", "Past_Violations", "Import_Quantity (kg)", "HS Code"]

# Initialize LIME explainer
# Note: We'll load this in the importer-risk route to avoid errors during startup
# since we don't have X_train_class available here
lime_explainer = None

# --------------------- AUTHENTICATION ROUTES ---------------------

# Helper: Hash password
def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt)

# Helper: Verify password
def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed)

# Helper: Generate JWT Token
def generate_token(email):
    payload = {
        "email": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    return encode(payload, app.config['SECRET_KEY'], algorithm="HS256")

# Signup Route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name, email, password = data["name"], data["email"], data["password"]

    if users_collection.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400

    hashed_password = hash_password(password)
    users_collection.insert_one({"name": name, "email": email, "password": hashed_password})

    return jsonify({"message": "Signup successful"}), 201

# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email, password = data["email"], data["password"]

    user = users_collection.find_one({"email": email})
    if user and verify_password(password, user["password"]):
        token = generate_token(email)
        return jsonify({"message": "Login successful", "token": token}), 200

    return jsonify({"message": "Invalid credentials"}), 401

# --------------------- CHEMICAL RISK ANALYSIS ROUTE ---------------------

# Preprocessing function
def preprocess_new_recipe(new_recipe_raw):
    def combine_chemicals(chemicals, quantities):
        combined = [f"{chem.strip()}:{re.sub(r'[^0-9.]+', '', qty)}"
                    for chem, qty in zip(chemicals.split("+"), quantities.split("+"))]
        return " + ".join(combined)

    new_recipe_raw["Combined Recipe"] = new_recipe_raw.apply(
        lambda row: combine_chemicals(row["Chemical Names"], row["Quantities (g/mL)"]), axis=1
    )
    return new_recipe_raw

# Flask route for analysis
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    print("Received Data:", data)

    # Extract chemical names and quantities
    chemicals = data.get("chemicals", [])
    
    if not chemicals:
        return jsonify({"error": "No chemicals provided"}), 400

    chemical_names = " + ".join([chem["name"].strip() for chem in chemicals])
    quantities = " + ".join([str(chem["quantity"]).strip() for chem in chemicals])

    # Create DataFrame with expected structure
    new_recipe_raw = pd.DataFrame([{"Chemical Names": chemical_names, "Quantities (g/mL)": quantities}])

    # Preprocess
    new_recipe_processed = preprocess_new_recipe(new_recipe_raw)
    
    # Vectorize
    new_recipe_tfidf = vectorizer.transform(new_recipe_processed["Combined Recipe"]).toarray()
    new_recipe_tfidf = pd.DataFrame(new_recipe_tfidf, columns=vectorizer.get_feature_names_out())

    # Predict
    predictions = regressor.predict(new_recipe_tfidf)

    # Format predictions
    predicted_df = pd.DataFrame({
        "Explosiveness (1-10)": predictions[:, 0] * 10,
        "Health Risk Score (0-100)": predictions[:, 1] * 100,
        "Risk Score (0-100)": predictions[:, 2] * 100
    })

    # Determine overall risk level
    def determine_risk_level(row):
        if any([row["Explosiveness (1-10)"] > 90, row["Health Risk Score (0-100)"] > 90, row["Risk Score (0-100)"] > 90]):
            return "Very High Risk"
        elif any([71 <= row["Explosiveness (1-10)"] <= 90, 71 <= row["Health Risk Score (0-100)"] <= 90, 71 <= row["Risk Score (0-100)"] <= 90]):
            return "High Risk"
        elif any([31 <= row["Explosiveness (1-10)"] <= 70, 31 <= row["Health Risk Score (0-100)"] <= 70, 31 <= row["Risk Score (0-100)"] <= 70]):
            return "Medium Risk"
        else:
            return "Low Risk"

    predicted_df["Overall Risk Level"] = predicted_df.apply(determine_risk_level, axis=1)

    # Prepare response
    response = {
        "explosiveness": predicted_df["Explosiveness (1-10)"].iloc[0],
        "health_risk": predicted_df["Health Risk Score (0-100)"].iloc[0],
        "risk_score": predicted_df["Risk Score (0-100)"].iloc[0],
        "overall_risk_level": predicted_df["Overall Risk Level"].iloc[0],
    }

    return jsonify(response)

# --------------------- FUTURE RISK PREDICTION ROUTE ---------------------

@app.route('/predict', methods=['POST'])
def predict():
    # Get input data from the request
    input_data = request.json
    
    # Convert the input to DataFrame
    input_df = pd.DataFrame(input_data)
    
    # 🔹 Encode categorical features using One-Hot Encoding
    categorical_cols = ['Compliance_History', 'Risk_Category', 'Chemical_Name', 'Country_of_Origin', 'Financial_Stability']
    input_df = pd.get_dummies(input_df, columns=categorical_cols)
    
    # 🔹 Apply scaling to numerical columns
    numerical_cols = ['Import_Frequency', 'Import_Quantity (kg)', 'Compliance_Score', 'Past_Violations', 'Import_Trend']
    input_df[numerical_cols] = scaler_future.transform(input_df[numerical_cols])
    
    # 🔹 Add missing one-hot encoded columns
    for col in trained_columns:
        if col not in input_df.columns:
            input_df[col] = 0  # Fill missing features with 0
    
    # 🔹 Reorder columns to match training order
    input_df = input_df[trained_columns]
    
    # 🔹 Make prediction using the neural network model
    prediction = model_future.predict(input_df)
    
    # 🔹 Decode the prediction
    prediction_label_nn = le.inverse_transform(prediction)
    
    # 🔹 Return the result as a JSON response
    return jsonify({"predicted_risk": prediction_label_nn[0]})

# --------------------- IMPORTER RISK PREDICTION ROUTE ---------------------

def preprocess_importer_data(input_data):
    """
    Map frontend field names to the names expected by the model.
    """
    # Create a mapping from frontend field names to model field names
    field_mapping = {
        "hsCode": "HS Code",
        "chemicalName": "Chemical_Name",
        "countryOfOrigin": "Country_of_Origin",
        "importationDescription": "Importation_Description",
        "complianceHistory": "Compliance_History",
        "financialStability": "Financial_Stability",
        "importFrequency": "Import_Frequency",
        "importVolume": "Import_Quantity (kg)",
        "pastViolations": "Past_Violations"
    }
    
    # Create a new dictionary with the mapped field names
    processed_data = {}
    for frontend_key, model_key in field_mapping.items():
        # Get the value, or use an appropriate default
        if model_key in numerical_cols:
            # For numerical fields, use 0 as default
            value = input_data.get(frontend_key, 0)
            # Convert string to int/float if needed
            if isinstance(value, str) and model_key == "HS Code":
                try:
                    value = int(value)
                except ValueError:
                    value = 0
            elif model_key == "Import_Quantity (kg)":
                try:
                    value = float(value)
                except ValueError:
                    value = 0.0
            else:
                try:
                    value = int(value)
                except ValueError:
                    value = 0
        else:
            # For categorical fields, use "" as default
            value = input_data.get(frontend_key, "")
            
        processed_data[model_key] = value
    
    return processed_data

def predict_importer_risk(input_data):
    """
    Process Importer Risk Data and Predict Risk Category & Probability.
    """
    # Preprocess the input data to match model expectations
    processed_data = preprocess_importer_data(input_data)
    
    # Convert input into DataFrame
    input_df = pd.DataFrame([processed_data])
    
    # Debug information
    print("Debug - Input DataFrame:")
    print(input_df)
    print("Debug - Categorical columns expected by encoder:")
    for i, col in enumerate(categorical_cols):
        if hasattr(encoder, 'categories_'):
            print(f"{col}: Expected categories: {encoder.categories_[i]}")
            print(f"{col}: Actual value: {input_df[col].values[0]}")
    
    # Process categorical features
    cat_features = encoder.transform(input_df[categorical_cols])
    cat_df = pd.DataFrame(cat_features, columns=encoder.get_feature_names_out(categorical_cols))
    
    # Process numerical features
    num_features = scaler.transform(input_df[numerical_cols])
    num_df = pd.DataFrame(num_features, columns=numerical_cols)
    
    # Combine processed features
    processed_input = pd.concat([num_df, cat_df], axis=1)
    
    # Make predictions
    predicted_class = clf.predict(processed_input)
    predicted_category = label_encoder.inverse_transform(predicted_class)[0]
    predicted_prob = reg.predict(processed_input)[0]
    
    return predicted_category, predicted_prob, processed_input

# Helper function to get LIME explanations
def get_lime_explanations(processed_input, num_features=5):
    """
    Generate LIME explanations for the importer risk prediction.
    
    Args:
        processed_input: The processed input data
        num_features: Number of top features to include in explanation
    
    Returns:
        Dictionary with feature importance information
    """
    global lime_explainer
    
    # Check if we have a training dataset loaded to initialize LIME
    try:
        # If X_train_class is not available, we'll load a sample dataset
        # This is a placeholder - in production, you'd load your actual training data
        if lime_explainer is None:
            # Load a sample of training data
            X_train_sample = joblib.load("X_train_sample.pkl")
            lime_explainer = lime.lime_tabular.LimeTabularExplainer(
                X_train_sample.values,
                feature_names=X_train_sample.columns.tolist(),
                class_names=label_encoder.classes_,
                mode="classification"
            )
    except Exception as e:
        print(f"Error initializing LIME explainer: {e}")
        return {"error": "Could not initialize LIME explainer"}
    
    try:
        # Get LIME explanation
        instance = processed_input.values[0]
        exp = lime_explainer.explain_instance(instance, clf.predict_proba, num_features=num_features)
        
        # Extract feature importance
        feature_importance = []
        for feature, importance in exp.as_list():
            feature_importance.append({
                "feature": feature,
                "importance": importance
            })
        
        return {
            "feature_importance": feature_importance,
            "model_confidence": exp.score
        }
    except Exception as e:
        print(f"Error generating LIME explanation: {e}")
        return {"error": str(e)}

# Helper function to get SHAP explanations
def get_shap_explanations(processed_input, model, X_train_sample_path="X_train_sample.pkl"):
    """
    Generate SHAP explanations for the importer risk prediction.
    
    Args:
        processed_input: The processed input data
        model: The trained model (classifier)
        X_train_sample_path: Path to a sample of training data for SHAP explainer
    
    Returns:
        Dictionary with SHAP values and feature importance plot
    """
    try:
        # Load sample training data for the explainer
        X_train_sample = joblib.load(X_train_sample_path)
        
        # Initialize SHAP explainer
        explainer = shap.Explainer(model, X_train_sample)
        
        # Compute SHAP values for the input
        shap_values = explainer(processed_input)
        
        # Convert SHAP values to list for JSON serialization
        shap_values_list = shap_values.values.tolist()[0]
        feature_names = processed_input.columns.tolist()
        
        # Create a dictionary of feature names and their SHAP values
        shap_dict = {feature: value for feature, value in zip(feature_names, shap_values_list)}
        
        # Sort by absolute SHAP value to find most important features
        sorted_features = sorted(
            shap_dict.items(), 
            key=lambda x: abs(x[1]), 
            reverse=True
        )
        
        # Get top features and their SHAP values
        top_features = [{"feature": feature, "shap_value": value} for feature, value in sorted_features[:10]]
        
        # Generate SHAP summary plot
        plt.figure(figsize=(10, 6))
        shap.plots.beeswarm(shap_values, show=False)
        plt.tight_layout(pad=2.0)
        
        # Save plot to a bytes buffer
        buf = BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight', dpi=100)
        plt.close()
        buf.seek(0)
        
        # Convert plot to base64 for embedding in response
        plot_base64 = base64.b64encode(buf.read()).decode('utf-8')
        
        return {
            "top_features": top_features,
            "plot": plot_base64,
        }
    
    except Exception as e:
        print(f"Error generating SHAP explanation: {e}")
        import traceback
        traceback.print_exc()
        return {"error": str(e)}

@app.route('/importer-risk', methods=['POST'])
def importer_risk():
    data = request.json
    print("✅ Received Importer Data:", data)

    try:
        # Ensure all necessary fields are present
        required_fields = ["hsCode", "chemicalName", "countryOfOrigin", 
                           "importationDescription", "complianceHistory", "financialStability", "importFrequency", "importVolume", "pastViolations"]

        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        # Get predictions
        predicted_category, predicted_prob, processed_input = predict_importer_risk(data)
        print("✅ Prediction - Category:", predicted_category, "Probability:", predicted_prob)
        
        # Include XAI explanations
        xai_method = data.get("xai_method", "lime")  # Default to LIME if not specified
        xai_data = {}
        
        if xai_method.lower() == "lime":
            try:
                xai_data = get_lime_explanations(processed_input)
                print("✅ LIME Explanations:", xai_data)
            except Exception as e:
                print(f"Error generating LIME explanations: {e}")
                xai_data = {"error": f"Failed to generate LIME explanations: {str(e)}"}
        elif xai_method.lower() == "shap":
            try:
                xai_data = get_shap_explanations(processed_input, clf)
                print("✅ SHAP Explanations:", xai_data)
            except Exception as e:
                print(f"Error generating SHAP explanations: {e}")
                xai_data = {"error": f"Failed to generate SHAP explanations: {str(e)}"}
        
        response = {
            "risk_category": predicted_category,
            "risk_probability": round(float(predicted_prob), 4),
            "xai_explanations": xai_data,
            "xai_method": xai_method
        }
        return jsonify(response)

    except Exception as e:
        print(f"Error: {e}")
        # Print more detailed error information
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

# --------------------- ALTERNATIVE XAI ENDPOINTS ---------------------

@app.route('/explain-prediction', methods=['POST'])
def explain_prediction():
    """
    Dedicated endpoint for LIME explanations of a specific prediction.
    """
    data = request.json
    
    try:
        # Process the input data the same way as in importer-risk
        _, _, processed_input = predict_importer_risk(data)
        
        # Get explanations
        num_features = data.get("num_features", 5)
        xai_data = get_lime_explanations(processed_input, num_features=num_features)
        
        return jsonify({
            "lime_explanations": xai_data
        })
        
    except Exception as e:
        print(f"Error explaining prediction with LIME: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error generating LIME explanation: {str(e)}"}), 500

@app.route('/explain-shap', methods=['POST'])
def explain_shap():
    """
    Dedicated endpoint for SHAP explanations of a specific prediction.
    """
    data = request.json
    
    try:
        # Process the input data the same way as in importer-risk
        _, _, processed_input = predict_importer_risk(data)
        
        # Get SHAP explanations
        shap_data = get_shap_explanations(processed_input, clf)
        
        return jsonify({
            "shap_explanations": shap_data
        })
        
    except Exception as e:
        print(f"Error explaining prediction with SHAP: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error generating SHAP explanation: {str(e)}"}), 500

# Function to generate a summary SHAP plot for the training data
def generate_shap_summary_plot(output_path="shap_summary_plot.png"):
    """
    Generate and save a SHAP summary plot for the training data.
    
    Args:
        output_path: Path to save the generated plot
    
    Returns:
        True if successful, False otherwise
    """
    try:
        # Load sample training data and labels
        X_train_sample = joblib.load("X_train_sample.pkl")
        y_train_sample = joblib.load("y_train_sample.pkl")
        
        # Initialize SHAP explainer
        explainer = shap.Explainer(clf, X_train_sample)
        
        # Compute SHAP values for the sample data
        shap_values = explainer(X_train_sample)
        
        # Set figure size and adjust margins
        plt.figure(figsize=(12, 8))
        plt.subplots_adjust(left=0.1, right=0.9, top=0.9, bottom=0.1)
        
        # Generate the summary plot
        shap.summary_plot(shap_values, X_train_sample, show=False)
        
        # Adjust layout and save
        plt.tight_layout(pad=2.0)
        plt.savefig(output_path, bbox_inches='tight', dpi=150)
        plt.close()
        
        return True
    
    except Exception as e:
        print(f"Error generating SHAP summary plot: {e}")
        import traceback
        traceback.print_exc()
        return False

@app.route('/generate-shap-summary', methods=['GET'])
def generate_shap_summary():
    """
    Endpoint to generate a SHAP summary plot for model analysis.
    """
    try:
        output_path = "shap_summary_plot.png"
        success = generate_shap_summary_plot(output_path)
        
        if success:
            return jsonify({
                "message": "SHAP summary plot generated successfully",
                "file_path": output_path
            })
        else:
            return jsonify({
                "error": "Failed to generate SHAP summary plot"
            }), 500
        
    except Exception as e:
        print(f"Error in SHAP summary endpoint: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Server error: {str(e)}"}), 500
    
# --------------------- END-USER RISK PREDICTION ---------------------    

# Load saved model and preprocessing objects
rf_model = joblib.load("Random_forest_model.pkl")
label_encoders = joblib.load("End_User_Label_Encoder.pkl")

# Define categorical and numerical columns (must match the ones used during training)
end_user_categorical_columns = ['Customer name', 'Product code', 'Invoice No', 'UOM', 'Warehouse']
end_user_numerical_columns = ['Issued Qty', 'Transaction Date']

# Prediction Function
def predict_risk_level(customer_name, issued_qty, transaction_date, product_code):
    """
    Predicts the risk level for a given customer based on provided data.
    """
    # Create a DataFrame for input data with all columns used during training
    end_user_input_data = pd.DataFrame({
        'Customer name': [customer_name],
        'Issued Qty': [issued_qty],
        'Transaction Date': [transaction_date],
        'Product code': [product_code],
        'Invoice No': [0],  # Add missing columns with default values
        'UOM': [0],
        'Warehouse': [0]
    })

    # Strip column names
    end_user_input_data.columns = end_user_input_data.columns.str.strip()

    # Convert Transaction Date to numeric
    end_user_input_data['Transaction Date'] = pd.to_datetime(end_user_input_data['Transaction Date'], errors='coerce')
    end_user_input_data['Transaction Date'] = end_user_input_data['Transaction Date'].astype(int) / 10**9

    # Encode categorical variables using trained label encoders
    for col in end_user_categorical_columns:
        if col in end_user_input_data.columns:
            if end_user_input_data[col][0] in label_encoders[col].classes_:
                end_user_input_data[col] = label_encoders[col].transform(end_user_input_data[col])
            else:
                print(f"Warning: Unseen category '{end_user_input_data[col][0]}' in '{col}'. Assigning default category 0.")
                end_user_input_data[col] = 0  # Assign unseen categories a default value

    # Fill missing numerical values
    end_user_input_data[end_user_numerical_columns] = end_user_input_data[end_user_numerical_columns].fillna(0)

    # Ensure all expected columns are present, adding missing ones as 0
    for col in rf_model.feature_names_in_:
        if col not in end_user_input_data.columns:
            end_user_input_data[col] = 0  # Fill missing columns with 0

    # Ensure correct feature order (same as during training)
    end_user_input_data = end_user_input_data[rf_model.feature_names_in_]

    # Make the prediction (no scaling required)
    predicted_risk = rf_model.predict(end_user_input_data)[0]

    return predicted_risk

# API Endpoint for Risk Prediction
@app.route('/predict-risk', methods=['POST'])
def predict_risk():
    """
    API endpoint to predict risk level based on user input.
    """
    try:
        # Get JSON data from the request
        data = request.get_json()
        print("Received data:", data)  

        # Extract input values
        customer_name = data.get('customer_name')
        issued_qty = data.get('issued_qty')
        transaction_date = data.get('transaction_date')
        product_code = data.get('product_code')

        # Validate input data
        if not all([customer_name, issued_qty, transaction_date, product_code]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Predict risk level
        predicted_risk = predict_risk_level(customer_name, issued_qty, transaction_date, product_code)
        print("Predicted risk:", predicted_risk)  

        # Convert numpy.int64 to a standard Python integer
        predicted_risk = int(predicted_risk)

        # Return the result as JSON
        return jsonify({'predicted_risk': predicted_risk}), 200

    except Exception as e:
        print("Error in predict_risk:", str(e))  
        return jsonify({'error': str(e)}), 500    

# --------------------- RUN FLASK APP ---------------------
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
