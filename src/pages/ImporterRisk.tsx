import { useState, useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, AlertCircle, AlertTriangle, CheckCircle, Shield, BarChart2, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const ImporterRisk = () => {
  // State for form values
  const [formData, setFormData] = useState({
    hsCode: "",
    chemicalName: "",
    countryOfOrigin: "",
    importationDescription: "",
    complianceHistory: "",
    financialStability: "",
    importFrequency: "",
    importVolume: "",
    pastViolations: "",
    importerID: "", // Added importerID here
    include_xai: true, 
    xai_type: "lime" 
  });

  // State for form validation errors
  const [formErrors, setFormErrors] = useState({
    hsCode: "",
    chemicalName: "",
    countryOfOrigin: "",
    importationDescription: "",
    complianceHistory: "",
    financialStability: "",
    importFrequency: "",
    importVolume: "",
    pastViolations: "",
    importerID: "", // Added importerID here
  });

  // State for prediction results
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [xaiData, setXaiData] = useState(null); // For XAI data (LIME or SHAP)
  const [animateFeatures, setAnimateFeatures] = useState(false); // Animation state

  // Data for dropdown menus
  const hsCodeOptions = [
    "282619", "280700", "283711", "280800", "282611", "280120", 
    "280110", "280130", "282911", "310210", "283719", "284800"
  ];
  
  const chemicalNameOptions = [
    "Fluorides; fluorosilicates, fluoroaluminates, and other complex fluorine salts",
    "Sulphuric acid; oleum",
    "Cyanides and cyanide oxides: Of sodium",
    "Nitric acid; sulphonitric acids",
    "Halides and halide oxides of non-metals",
    "Iodine",
    "Chlorine",
    "Bromine",
    "Chlorates and perchlorates; bromates and perbromates; iodates and periodates",
    "Mineral or chemical fertilizers, nitrogenous",
    "Cyanides and cyanide oxides: Other",
    "Hydrogen peroxide, whether or not solidified with urea"
  ];
  
  const countryOfOriginOptions = [
    "Pakistan", "Brazil", "India", "China", "USA", "Germany", 
    "South Korea", "France", "Russia", "United Kingdom", "Japan", "Canada"
  ];
  
  const importationDescriptionOptions = [
    "Used in aluminum smelting & glass manufacturing",
    "Petroleum refining & chemical synthesis",
    "Gold mining & electroplating industry",
    "Used in fertilizer manufacturing & explosives production",
    "Semiconductor manufacturing & etching process",
    "Pharmaceutical & medical applications",
    "Industrial water purification & disinfection",
    "Used in flame retardants & water treatment",
    "Manufacturing of explosives & oxidizing agents",
    "Agriculture sector, soil nutrient enhancement",
    "Used in synthetic organic chemistry & pest control",
    "Textile bleaching & paper pulp industry"
  ];
  
  const complianceHistoryOptions = ["Excellent", "Good", "Fair", "Poor"];
  
  const financialStabilityOptions = ["High", "Medium", "Low"];

  // Required fields
  const requiredFields = [
    "hsCode", 
    "chemicalName", 
    "countryOfOrigin", 
    "importationDescription", 
    "complianceHistory", 
    "financialStability", 
    "importFrequency", 
    "importVolume", 
    "pastViolations",
    "importerID" // Added importerID here
  ];

  // Handle form input changes
  const handleInputChange = (field, value) => {
    // Update form data
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear the error for this field if value is not empty
    if (value && value.toString().trim() !== '') {
      setFormErrors({
        ...formErrors,
        [field]: ""
      });
    }
  };

  // Validate all form fields
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...formErrors };
    
    // Check each required field for emptiness
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
        valid = false;
      } else {
        newErrors[field] = "";
      }
    });
    
    // Special validation for numeric fields
    const numericFields = ["importFrequency", "importVolume", "pastViolations"];
    numericFields.forEach(field => {
      if (formData[field] && isNaN(Number(formData[field]))) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} must be a number`;
        valid = false;
      }
    });
    
    // Special validation for importerID format
    if (formData.importerID && !/^IMP\d{3}$/.test(formData.importerID)) {
      newErrors.importerID = "Importer ID must be in format IMP followed by 3 digits (e.g., IMP001)";
      valid = false;
    }
    
    setFormErrors(newErrors);
    return valid;
  };

  // Toggle XAI type between LIME and SHAP
  const toggleXaiType = (type) => {
    setFormData({
      ...formData,
      xai_type: type
    });
    
    // If we already have a prediction and XAI data, refresh the explanation
    if (prediction && xaiData) {
      handleExplainRequest(type);
    }
  };

  // Submit form data to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form before submission
    if (!validateForm()) {
      setError("Please fill in all required fields correctly.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setXaiData(null); // Reset XAI data
    setAnimateFeatures(false); // Reset animation state

    try {
      // Create a copy of formData without importerID to send to the API
      const { importerID, ...dataToSend } = formData;
      
      const response = await fetch('http://127.0.0.1:5000/importer-risk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), // Send data without importerID
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result); // Debug log to see actual response
      
      // Extract XAI data if available
      if (result.xai_explanations && !result.xai_explanations.error) {
        setXaiData(result.xai_explanations);
        // Trigger animation after a small delay to ensure DOM is updated
        setTimeout(() => setAnimateFeatures(true), 100);
      }
      
      // Improved parsing logic to handle the API response consistently
      let transformedResult;
      
      // If result is a string (like in your example)
      if (typeof result === 'string') {
        // Extract Category and Probability using regex
        const categoryMatch = result.match(/Category: (\w+\s?\w*)/);
        const probabilityMatch = result.match(/Probability: ([\d.]+)/);
        
        if (categoryMatch && probabilityMatch) {
          const category = categoryMatch[1].trim();
          const probability = parseFloat(probabilityMatch[1]);
          
          transformedResult = {
            risk_category: category,
            risk_probability: probability,
            risk_percentage: Math.round(probability * 100),
            input_data: {
              Past_Violations: formData.pastViolations,
              Compliance_History: formData.complianceHistory,
              Financial_Stability: formData.financialStability,
            }
          };
        } else {
          throw new Error("Failed to parse prediction result");
        }
      } 
      // If result is already a JSON object with Category and Probability
      else if (result && (result.Category !== undefined || result.risk_category !== undefined)) {
        // Handle different possible formats
        const category = result.Category || result.risk_category || "Unknown";
        const probability = parseFloat(result.Probability || result.risk_probability || 0);
        
        transformedResult = {
          risk_category: category,
          risk_probability: probability,
          risk_percentage: Math.round(probability * 100),
          input_data: {
            Past_Violations: formData.pastViolations,
            Compliance_History: formData.complianceHistory,
            Financial_Stability: formData.financialStability,
          }
        };
      }
      // If the result is in an unexpected format, try to extract from raw text
      else if (result) {
        const resultStr = JSON.stringify(result);
        const categoryMatch = resultStr.match(/Risky|Not Risky/i);
        const probabilityMatch = resultStr.match(/([\d.]+)/);
        
        if (categoryMatch && probabilityMatch) {
          transformedResult = {
            risk_category: categoryMatch[0],
            risk_probability: parseFloat(probabilityMatch[1]),
            risk_percentage: Math.round(parseFloat(probabilityMatch[1]) * 100),
            input_data: {
              Past_Violations: formData.pastViolations,
              Compliance_History: formData.complianceHistory,
              Financial_Stability: formData.financialStability,
            }
          };
        } else {
          throw new Error("Unexpected response format from API");
        }
      } else {
        throw new Error("Empty or invalid response from API");
      }
      
      setPrediction(transformedResult);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to get prediction. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  const isRisky = (category) => {
    if (!category) return false;
    const lowerCategory = category.toLowerCase();
    return lowerCategory === "risky" || (lowerCategory.includes("risky") && !lowerCategory.startsWith("not"));
  };

  // Get color based on risk category
  const getRiskColor = (category) => {
    if (!category) return "text-gray-500";
    
    if (isRisky(category)) {
      return "text-red-500";
    } else {
      return "text-green-500";
    }
  };

  // Get background color for progress bars based on importance (positive or negative)
  const getBarColor = (importance, method = "lime") => {
    if (method === "shap") {
      // SHAP values can be positive (increasing risk) or negative (decreasing risk)
      return importance > 0 ? "bg-red-500" : "bg-blue-500";
    } else {
      // For LIME, higher values are more important regardless of direction
      return importance > 0.3 ? "bg-red-500" : 
             importance > 0.15 ? "bg-orange-400" : "bg-blue-500";
    }
  };

  // Get icon based on risk category
  const getRiskIcon = (category) => {
    if (!category) return <AlertCircle className="w-12 h-12 text-gray-400" />;
    
    if (isRisky(category)) {
      return <AlertTriangle className="w-12 h-12 text-red-500" />;
    } else {
      return <CheckCircle className="w-12 h-12 text-green-500" />;
    }
  };

  // Handle request for XAI explanation
  const handleExplainRequest = async (type = formData.xai_type) => {
    if (!prediction) return;
    
    setLoading(true);
    setAnimateFeatures(false); // Reset animation
    
    try {
      // Create a copy of formData without importerID
      const { importerID, ...dataToSend } = formData;
      
      // Adjust the endpoint based on the explanation type
      const endpoint = type === "shap" ? 
        'http://127.0.0.1:5000/explain-prediction-shap' : 
        'http://127.0.0.1:5000/explain-prediction';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...dataToSend, // Send data without importerID
          xai_type: type,
          num_features: 5 // Request top 5 features
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`${type.toUpperCase()} Response:`, result);
      
      if (result.xai_explanations) {
        setXaiData(result.xai_explanations);
        // Trigger animation after a small delay to ensure DOM is updated
        setTimeout(() => setAnimateFeatures(true), 100);
      } else {
        throw new Error("No explanation data received");
      }
    } catch (err) {
      console.error(`Error getting ${type} explanation:`, err);
      setError(`Failed to get ${type.toUpperCase()} explanation. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient py-16">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Importer Risk</span> Prediction
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Analyze historical chemical import data to assess associated risks and compliance patterns
          </p>
        </header>

        {/* Form Error Summary - display at the top if there are validation errors */}
        {Object.values(formErrors).some(err => err !== "") && (
          <div className="max-w-5xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertCircle className="w-5 h-5 mr-2" />
                <h3 className="font-medium">Please correct the following errors:</h3>
              </div>
              <ul className="list-disc ml-5 space-y-1 text-sm">
                {Object.entries(formErrors).map(([field, error]) => (
                  error ? <li key={field}>{error}</li> : null
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="glass-card p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-teal-500" />
              <h2 className="text-xl font-semibold">Importer Details</h2>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Importer ID */}
              <div>
                <Label htmlFor="importerID" className="text-sm text-gray-600 mb-1 block">
                  Importer ID *
                </Label>
                <Input 
                  id="importerID"
                  placeholder="Enter Importer ID (e.g., IMP001)"
                  value={formData.importerID}
                  onChange={(e) => handleInputChange("importerID", e.target.value)}
                  className={`w-full ${formErrors.importerID ? 'border-red-500' : ''}`}
                  required
                />
                {formErrors.importerID && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.importerID}</p>
                )}
              </div>
              
              {/* Import Frequency */}
              <div>
                <Label htmlFor="importFrequency" className="text-sm text-gray-600 mb-1 block">
                  Import Frequency *
                </Label>
                <Input 
                  id="importFrequency"
                  placeholder="Enter import frequency"
                  type="number"
                  value={formData.importFrequency}
                  onChange={(e) => handleInputChange("importFrequency", e.target.value)}
                  className={`w-full ${formErrors.importFrequency ? 'border-red-500' : ''}`}
                  required
                />
                {formErrors.importFrequency && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.importFrequency}</p>
                )}
              </div>
              
              {/* Past Violations */}
              <div>
                <Label htmlFor="pastViolations" className="text-sm text-gray-600 mb-1 block">
                  Past Violations *
                </Label>
                <Input 
                  id="pastViolations"
                  placeholder="Enter number of past violations" 
                  type="number" 
                  value={formData.pastViolations}
                  onChange={(e) => handleInputChange("pastViolations", e.target.value)}
                  className={`w-full ${formErrors.pastViolations ? 'border-red-500' : ''}`}
                  required
                />
                {formErrors.pastViolations && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.pastViolations}</p>
                )}
              </div>
              
              {/* HS Code Dropdown */}
              <div>
                <Label htmlFor="hsCode" className="text-sm text-gray-600 mb-1 block">
                  HS Code *
                </Label>
                <Select
                  value={formData.hsCode}
                  onValueChange={(value) => handleInputChange("hsCode", value)}
                  required
                >
                  <SelectTrigger id="hsCode" className={`w-full ${formErrors.hsCode ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select HS Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {hsCodeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.hsCode && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.hsCode}</p>
                )}
              </div>
              
              {/* Chemical Name Dropdown */}
              <div>
                <Label htmlFor="chemicalName" className="text-sm text-gray-600 mb-1 block">
                  Chemical Name *
                </Label>
                <Select
                  value={formData.chemicalName}
                  onValueChange={(value) => handleInputChange("chemicalName", value)}
                  required
                >
                  <SelectTrigger id="chemicalName" className={`w-full ${formErrors.chemicalName ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select Chemical Name" />
                  </SelectTrigger>
                  <SelectContent>
                    {chemicalNameOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.chemicalName && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.chemicalName}</p>
                )}
              </div>
              
              {/* Country of Origin Dropdown */}
              <div>
                <Label htmlFor="countryOfOrigin" className="text-sm text-gray-600 mb-1 block">
                  Country of Origin *
                </Label>
                <Select
                  value={formData.countryOfOrigin}
                  onValueChange={(value) => handleInputChange("countryOfOrigin", value)}
                  required
                >
                  <SelectTrigger id="countryOfOrigin" className={`w-full ${formErrors.countryOfOrigin ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select Country of Origin" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOfOriginOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.countryOfOrigin && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.countryOfOrigin}</p>
                )}
              </div>
              
              {/* Importation Description Dropdown */}
              <div>
                <Label htmlFor="importationDescription" className="text-sm text-gray-600 mb-1 block">
                  Importation Description *
                </Label>
                <Select
                  value={formData.importationDescription}
                  onValueChange={(value) => handleInputChange("importationDescription", value)}
                  required
                >
                  <SelectTrigger id="importationDescription" className={`w-full ${formErrors.importationDescription ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select Importation Description" />
                  </SelectTrigger>
                  <SelectContent>
                    {importationDescriptionOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.importationDescription && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.importationDescription}</p>
                )}
              </div>
              
              {/* Compliance History Dropdown */}
              <div>
                <Label htmlFor="complianceHistory" className="text-sm text-gray-600 mb-1 block">
                  Compliance History *
                </Label>
                <Select
                  value={formData.complianceHistory}
                  onValueChange={(value) => handleInputChange("complianceHistory", value)}
                  required
                >
                  <SelectTrigger id="complianceHistory" className={`w-full ${formErrors.complianceHistory ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select Compliance History" />
                  </SelectTrigger>
                  <SelectContent>
                    {complianceHistoryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.complianceHistory && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.complianceHistory}</p>
                )}
              </div>
              
              {/* Financial Stability Dropdown */}
              <div>
                <Label htmlFor="financialStability" className="text-sm text-gray-600 mb-1 block">
                  Financial Stability *
                </Label>
                <Select
                  value={formData.financialStability}
                  onValueChange={(value) => handleInputChange("financialStability", value)}
                  required
                >
                  <SelectTrigger id="financialStability" className={`w-full ${formErrors.financialStability ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select Financial Stability" />
                  </SelectTrigger>
                  <SelectContent>
                    {financialStabilityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.financialStability && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.financialStability}</p>
                )}
              </div>
              
              {/* Import Volume */}
              <div>
                <Label htmlFor="importVolume" className="text-sm text-gray-600 mb-1 block">
                  Import Volume (kg/L) *
                </Label>
                <Input 
                  id="importVolume"
                  placeholder="Enter import volume" 
                  type="number" 
                  value={formData.importVolume}
                  onChange={(e) => handleInputChange("importVolume", e.target.value)}
                  className={`w-full ${formErrors.importVolume ? 'border-red-500' : ''}`}
                  required
                />
                {formErrors.importVolume && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.importVolume}</p>
                )}
              </div>
              
              {/* XAI Type Selection */}
              <div className="flex space-x-2 items-center">
                <div className="flex-1">
                  <Label htmlFor="xai-toggle" className="text-sm text-gray-600">
                    Include XAI Explanation
                  </Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Switch
                      id="xai-toggle"
                      checked={formData.include_xai}
                      onCheckedChange={(checked) => 
                        handleInputChange("include_xai", checked)
                      }
                    />
                    <span className="text-sm text-gray-500">
                      {formData.include_xai ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
                
                {formData.include_xai && (
                  <div className="flex-1">
                    <Label className="text-sm text-gray-600">
                      Explanation Method
                    </Label>
                    <div className="flex space-x-2 mt-1">
                      <Button
                        type="button"
                        size="sm"
                        variant={formData.xai_type === "lime" ? "default" : "outline"}
                        className={formData.xai_type === "lime" ? "bg-teal-500" : ""}
                        onClick={() => toggleXaiType("lime")}
                      >
                        LIME
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={formData.xai_type === "shap" ? "default" : "outline"}
                        className={formData.xai_type === "shap" ? "bg-gradient-to-r from-indigo-500 to-purple-500" : ""}
                        onClick={() => toggleXaiType("shap")}
                      >
                        SHAP
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-2">* Required fields</p>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-teal-400 to-teal-500 transition-all duration-300 hover:scale-105"
                  disabled={loading}
                >
                  {loading ? "Analyzing..." : "Analyze Risk"}
                </Button>
              </div>
            </form>
          </Card>

          <Card className="glass-card p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-teal-500" />
              <h2 className="text-xl font-semibold">Risk Assessment</h2>
            </div>
            <div className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-md">
                  <p>{error}</p>
                </div>
              )}
              
              {!prediction && !loading && !error && (
                <div className="text-center p-8">
                  <p className="text-gray-500">Submit importer details to see risk assessment</p>
                </div>
              )}
              
              {loading && (
                <div className="text-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Analyzing risk factors...</p>
                </div>
              )}
              
            {prediction && (
              <div className="space-y-6">
                <div className={`flex flex-col items-center justify-center p-6 rounded-lg transition-all duration-300 ${
                  isRisky(prediction.risk_category)
                    ? "bg-red-100 border border-red-200 shadow-md shadow-red-100" 
                    : "bg-green-100 border border-green-200 shadow-md shadow-green-100"
                }`}>
                  <div className={`transform transition-all duration-500 ${prediction ? 'scale-100' : 'scale-0'}`}>
                    {getRiskIcon(prediction.risk_category)}
                  </div>
                  <h3 className={`text-2xl font-bold mt-4 ${getRiskColor(prediction.risk_category)} transition-all duration-500`}>
                    {prediction.risk_category}
                  </h3>
                  <div className="relative w-full max-w-md h-6 bg-gray-200 rounded-full mt-4">
                    <div
                      className={`h-6 rounded-full ${
                        isRisky(prediction.risk_category)
                          ? "bg-red-500" 
                          : "bg-green-500"
                      } transition-all duration-1000 ease-out`}
                      style={{ width: `${prediction.risk_percentage}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-black font-bold shadow-sm">
                      {prediction.risk_percentage}%
                    </span>
                  </div>
                </div>
                
                {/* XAI Feature Importance Section - Now with Animation */}
                {xaiData && xaiData.feature_importance && (
                  <div className={`border-t pt-4 ${
                    isRisky(prediction.risk_category) 
                      ? "border-red-200" 
                      : "border-green-200"
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BarChart2 className={`w-5 h-5 ${
                          isRisky(prediction.risk_category) ? "text-red-500" : "text-green-500"
                        }`} />
                        <h4 className="text-lg font-semibold">
                          {formData.xai_type === "shap" ? "SHAP Values" : "Feature Importance"}:
                        </h4>
                      </div>
                      {formData.xai_type === "shap" && (
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                          <span className="mr-2">Increases Risk</span>
                          <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                          <span>Decreases Risk</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {xaiData.feature_importance.map((feature, index) => (
                        <div key={index} className="flex flex-col">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{feature.feature}</span>
                            <span className="text-sm font-medium">
                              {Math.abs(feature.importance).toFixed(3)}
                              {formData.xai_type === "shap" && feature.importance < 0 && " (-)"}
                              {formData.xai_type === "shap" && feature.importance > 0 && " (+)"}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className={`h-3 rounded-full ${getBarColor(feature.importance, formData.xai_type)} transition-all duration-1000 ease-out ${animateFeatures ? '' : 'w-0'}`}
                              style={{ 
                                width: animateFeatures ? `${Math.min(Math.abs(feature.importance) * 100, 100)}%` : '0%',
                                transitionDelay: `${index * 150}ms`
                              }}
                            ></div>
                          </div>
                          {formData.xai_type === "shap" && (
                            <p className="text-xs text-gray-500 mt-1">
                              {feature.importance > 0 
                                ? `${feature.feature} increases risk prediction` 
                                : `${feature.feature} decreases risk prediction`}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    {xaiData.model_confidence && (
                      <p className="text-sm text-gray-600 mt-4 flex items-center">
                        <Info className="w-4 h-4 mr-1" /> 
                        Model confidence: {(xaiData.model_confidence * 100).toFixed(1)}%
                      </p>
                    )}
                  </div>
                )}
                
                {/* Risk Factors Section */}
                {isRisky(prediction.risk_category) && (
                  <div className="border-t border-red-200 pt-4 bg-red-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2 text-red-700">Risk Factors:</h4>
                    <ul className="space-y-2">
                      {prediction.input_data.Past_Violations > 0 && (
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                          <span className="text-red-700">Past violations: {prediction.input_data.Past_Violations}</span>
                        </li>
                      )}
                      {prediction.input_data.Compliance_History !== "Excellent" && (
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                          <span className="text-red-700">Compliance history: {prediction.input_data.Compliance_History}</span>
                        </li>
                      )}
                      {prediction.input_data.Financial_Stability !== "High" && (
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                          <span className="text-red-700">Financial stability rating: {prediction.input_data.Financial_Stability}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                
                {/* Safe Factors Section (new section for non-risky assessments) */}
                {!isRisky(prediction.risk_category) && (
                  <div className="border-t border-green-200 pt-4 bg-green-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2 text-green-700">Safety Factors:</h4>
                    <ul className="space-y-2">
                      {prediction.input_data.Past_Violations === 0 && (
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <span className="text-green-700">No past violations</span>
                        </li>
                      )}
                      {prediction.input_data.Compliance_History === "Excellent" && (
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <span className="text-green-700">Excellent compliance history</span>
                        </li>
                      )}
                      {prediction.input_data.Financial_Stability === "High" && (
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <span className="text-green-700">High financial stability</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                
                {/* Show Explanation Button if no XAI data yet */}
                {!xaiData && !loading && (
                  <div className="flex flex-col space-y-2 items-center">
                    <p className="text-sm text-gray-600">Choose an explanation method:</p>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleExplainRequest("lime")}
                        className={`transition-all duration-300 ${
                          isRisky(prediction.risk_category) 
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                        disabled={loading}
                      >
                        <BarChart2 className="w-4 h-4 mr-2" />
                        LIME Explanation
                      </Button>
                      <Button 
                        onClick={() => handleExplainRequest("shap")}
                        className={`transition-all duration-300 ${
                          isRisky(prediction.risk_category) 
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                        disabled={loading}
                      >
                        <BarChart2 className="w-4 h-4 mr-2" />
                        SHAP Explanation
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className={`border-t pt-4 ${
                  isRisky(prediction.risk_category) 
                    ? "border-red-200" 
                    : "border-green-200"
                }`}>
                  <h4 className={`text-lg font-semibold mb-2 ${
                    isRisky(prediction.risk_category) 
                      ? "text-red-700" 
                      : "text-green-700"
                  }`}>Recommendation:</h4>
                  <div className={`p-3 rounded-md ${
                    isRisky(prediction.risk_category) 
                      ? "bg-red-50 border border-red-200" 
                      : "bg-green-50 border border-green-200"
                  }`}>
                    <p className={`flex items-start gap-2 ${
                      isRisky(prediction.risk_category) 
                        ? "text-red-700" 
                        : "text-green-700"
                    }`}>
                      {isRisky(prediction.risk_category) ? (
                        <>
                          <Shield className="w-5 h-5 mt-0.5" />
                          <span>Thorough inspection and documentation review recommended before approval.</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mt-0.5" />
                          <span>Standard inspection procedures should be sufficient.</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImporterRisk;
