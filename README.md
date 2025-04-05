# **Data Science Group Project - Chemical Handling and Risk Analysis System**

## **Overview**
This project is an AI-driven **Chemical Handling and Risk Analysis System** developed by **DSGP Group 32**. The system integrates predictive models to assess the risk associated with the importation, handling, and usage of chemicals. The project includes a **React.js frontend**, a **backend with machine learning models**, and **finalized model training scripts** in a **Colab notebook**.

The system utilizes **Gradient Boosting** and other machine learning algorithms to predict risks at various stages and prevent hazardous activities related to chemical use.

---

## **Project Structure**
The repository is divided into the following main sections:

- **Frontend (React.js)**: The user interface developed using React.js to interact with the system.
- **Backend**: Contains the machine learning models, APIs, and logic for risk prediction and analysis.
- **Finalized Colab Notebooks**: Contains the Colab notebooks where model training, evaluation, and final implementations were completed.

---

## **Features**
The system includes the following key features:

- **Importer Risk Prediction**: Predicts the risk associated with chemical importers based on their importation history.
- **End-User Risk Prediction**: Assesses the risk of illegal chemical use by analyzing end-user purchase patterns.
- **Chemical Recipe Risk Analysis**: Analyzes chemical combinations and predicts the risk of creating hazardous substances.
- **Importation Trend Prediction**: Forecasts future chemical importation trends based on historical data.

---

## **Frontend (React.js)**
The frontend of the system was developed using **React.js** and provides an interface for users to:

- View chemical risk analysis results
- Submit data related to chemical importation, end-users, and chemical recipes
- View alerts and notifications on risks and suspicious activities

---

## **Backend (Machine Learning Models)**
The backend contains the models responsible for predicting risks. The backend includes:

- Risk prediction models for importers, end-users, and chemical recipes.
- APIs that provide data to the frontend and handle incoming requests.
- Data preprocessing and feature engineering to prepare the dataset for model training.

---

## **Finalized Colab Notebooks**
The **Colab notebooks** contain the following:

- Data preprocessing steps for cleaning and transforming data.
- Model training using **Gradient Boosting Classifiers** and **Regressors**.
- Model evaluation to assess the performance of the trained models.
- Hyperparameter tuning for better accuracy and precision.

---

## **Technologies Used**
- **Frontend**: React.js, HTML, CSS, JavaScript
- **Backend**: Python, Flask/Django (depending on your backend framework), Scikit-learn (for ML models)
- **Machine Learning**: Gradient Boosting Classifier, Gradient Boosting Regressor
- **Data Processing**: Pandas, NumPy
- **Deployment**: Docker (if applicable), Heroku/AWS (for deployment)
- **Visualization**: Matplotlib, Seaborn (for visualizing results)

---

## **Setup and Installation**

### **Prerequisites**
- **Node.js** (for the React.js frontend)
- **Python 3.6 or higher** (for the backend and models)
- **pip** (Python package manager)

### **Frontend Setup (React.js)**

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Start the frontend server:
   ```bash
   npm start
   ```

This will launch the React app on your local server (typically at http://localhost:3000).

### **Backend Setup**

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install the required Python libraries:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the backend server (Flask/Django):
   ```bash
   python app.py  # or use the command specific to your framework
   ```

### **Colab Notebooks**
1. Open the finalized model training notebooks in Google Colab.
2. Run the cells to train the models, evaluate them, and save the final trained models.

### **Requirements File (requirements.txt)**
Make sure the backend/requirements.txt contains the necessary libraries:

```txt
pandas
numpy
scikit-learn
flask  # or django if you're using Django
matplotlib
seaborn
```

---

## **Usage**

### **1. Frontend (React.js)**
Navigate to the React.js frontend and interact with the user interface:
- Submit data for chemical importation, end-users, or recipes.
- View risk prediction results.
- Receive alerts based on suspicious activity or potential risks.

### **2. Backend (Model APIs)**
The backend exposes APIs that interact with the models. These APIs are designed to:
- Handle incoming user data.
- Make predictions based on the trained models.
- Provide feedback to the frontend for display.

### **3. Finalized Model Training (Colab Notebooks)**
- Use the Colab notebooks for retraining or testing the models.
- Implement any changes or updates to the training scripts as needed.

---

## **Contributing**
We welcome contributions to improve the project! To contribute:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature-name`).
3. Make your changes and commit (`git commit -am 'Add feature-name'`).
4. Push to your branch (`git push origin feature-name`).
5. Open a pull request.

---

## **License**
This project is licensed under the MIT License - see the LICENSE file for details.

---

## **Contact**
For any questions or issues, please contact the following members:

- **Fathima Shabna Ilmi** (Project Leader)  
  Email: fathima.20230079@iit.ac.lk

- **Senuth Perera**  
  Email: senuth.20230317@iit.ac.lk

- **Kalana Kannangara**  
  Email: kalana.20232632@iit.ac.lk

- **Loganathan Thusharkanth**  
  Email: thusharkanth.20233168@iit.ac.lk
