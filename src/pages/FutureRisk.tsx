import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChartLine, TrendingUp } from "lucide-react";
import { CheckCircle, XCircle } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Legend, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, AreaChart, Area
} from "recharts";

const FutureRisk = () => {
  const [formData, setFormData] = useState({
    "Importer_ID": "",
    "Import_Frequency": "",
    "Chemical_Name": "",
    "Country_of_Origin": "",
    "Import_Quantity (kg)": "",
    "Compliance_History": "",
    "Compliance_Score": "",
    "Past_Violations": "",
    "Import_Trend": "",
    "Risk_Category": "",
    "Financial_Stability": ""
  });

  const [prediction, setPrediction] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Check all fields - no optional fields allowed
    Object.entries(formData).forEach(([key, value]) => {
      if (!value || value.trim() === "") {
        newErrors[key] = "This field is required";
      }
    });
    
    // Additional validation for number inputs to ensure they're not just spaces
    const numberFields = ["Import_Frequency", "Import_Quantity (kg)", "Compliance_Score", "Past_Violations", "Import_Trend"];
    numberFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (value && (isNaN(Number(value)) || Number(value) < 0)) {
        newErrors[field] = "Please enter a valid positive number";
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Create a copy without the Importer_ID for model submission
      const modelData = { ...formData };
      delete modelData.Importer_ID;
      
      // Extra validation to ensure no null or empty values are sent to the API
      const hasEmptyValues = Object.values(modelData).some(value => 
        value === null || value === undefined || value === ""
      );
      
      if (hasEmptyValues) {
        setErrors({ form: "Please complete all fields before submitting" });
        return;
      }
      
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([modelData])
      });

      const data = await response.json();
      setPrediction(data.predicted_risk);
    } catch (error) {
      console.error("Prediction error:", error);
      setPrediction("Error generating prediction.");
    }
  };

  // Generate risk data points based on form values and prediction
  const generateRiskProjection = () => {
    const baseValue = parseFloat(formData.Compliance_Score) || 50;
    const violationImpact = (parseFloat(formData.Past_Violations) || 0) * 5;
    const isIncreasing = prediction?.toLowerCase().includes("increase") || false;
    
    return [
      { month: 'Current', risk: baseValue },
      { month: 'Month 1', risk: isIncreasing ? baseValue + 5 : baseValue - 5 },
      { month: 'Month 2', risk: isIncreasing ? baseValue + 12 : baseValue - 10 },
      { month: 'Month 3', risk: isIncreasing ? baseValue + 22 : baseValue - 18 },
      { month: 'Month 4', risk: isIncreasing ? baseValue + 35 : baseValue - 25 },
      { month: 'Month 5', risk: isIncreasing ? baseValue + 50 : baseValue - 30 },
    ];
  };

  // Prepare radar chart data from form values
  const getRadarData = () => {
    return [
      {
        subject: 'Freq',
        A: parseFloat(formData.Import_Frequency) || 0,
        fullMark: 100,
      },
      {
        subject: 'Quantity',
        A: Math.min(100, (parseFloat(formData["Import_Quantity (kg)"]) || 0) / 10),
        fullMark: 100,
      },
      {
        subject: 'Compliance',
        A: parseFloat(formData.Compliance_Score) || 0,
        fullMark: 100,
      },
      {
        subject: 'Violations',
        A: Math.min(100, (parseFloat(formData.Past_Violations) || 0) * 10),
        fullMark: 100,
      },
      {
        subject: 'Trend',
        A: parseFloat(formData.Import_Trend) || 0,
        fullMark: 100,
      },
    ];
  };

  // Generate comparison data for bar chart
  const getComparisonData = () => {
    const industryAverage = {
      frequency: 65,
      quantity: 75,
      compliance: 70,
      violations: 30,
      trend: 60
    };
    
    return [
      { 
        name: "Frequency", 
        Current: parseFloat(formData.Import_Frequency) || 0,
        Industry: industryAverage.frequency
      },
      { 
        name: "Quantity", 
        Current: Math.min(100, (parseFloat(formData["Import_Quantity (kg)"]) || 0) / 10),
        Industry: industryAverage.quantity
      },
      { 
        name: "Compliance", 
        Current: parseFloat(formData.Compliance_Score) || 0,
        Industry: industryAverage.compliance
      },
      { 
        name: "Violations", 
        Current: Math.min(100, (parseFloat(formData.Past_Violations) || 0) * 10),
        Industry: industryAverage.violations
      },
      { 
        name: "Trend", 
        Current: parseFloat(formData.Import_Trend) || 0,
        Industry: industryAverage.trend
      }
    ];
  };

  return (
    <div className="min-h-screen hero-gradient py-16">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Future</span> Risk Prediction
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Forecast potential risks based on historical import trends and patterns
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="glass-card p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-teal-500" />
              <h2 className="text-xl font-semibold">Trend Analysis</h2>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {errors.form && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                  <p className="text-red-600 text-sm">{errors.form}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Importer ID <span className="text-red-500">*</span></label>
                <Input
                  name="Importer_ID"
                  value={formData.Importer_ID}
                  onChange={handleChange}
                  placeholder="Enter Importer ID"
                  className={`w-full ${errors.Importer_ID ? 'border-red-500' : ''}`}
                  required
                />
                {errors.Importer_ID && (
                  <p className="text-red-500 text-xs mt-1">{errors.Importer_ID}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Import Frequency <span className="text-red-500">*</span></label>
                <Input
                  name="Import_Frequency"
                  value={formData.Import_Frequency}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Import Frequency"
                  className={`w-full ${errors.Import_Frequency ? 'border-red-500' : ''}`}
                  required
                />
                {errors.Import_Frequency && (
                  <p className="text-red-500 text-xs mt-1">{errors.Import_Frequency}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Chemical Name <span className="text-red-500">*</span></label>
                <select 
                  name="Chemical_Name" 
                  value={formData.Chemical_Name}
                  onChange={handleChange} 
                  className={`w-full p-2 border rounded-md ${errors.Chemical_Name ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select Chemical Name</option>
                  <option value="Bromine">Bromine</option>
                  <option value="Fluorides">Fluorides</option>
                  <option value="Chlorine">Chlorine</option>
                  <option value="Cyanides">Cyanides</option>
                  <option value="Iodine">Iodine</option>
                </select>
                {errors.Chemical_Name && (
                  <p className="text-red-500 text-xs mt-1">{errors.Chemical_Name}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Country of Origin <span className="text-red-500">*</span></label>
                <select 
                  name="Country_of_Origin" 
                  value={formData.Country_of_Origin}
                  onChange={handleChange} 
                  className={`w-full p-2 border rounded-md ${errors.Country_of_Origin ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select Country of Origin</option>
                  <option value="Japan">Japan</option>
                  <option value="Canada">Canada</option>
                  <option value="Russia">Russia</option>
                  <option value="France">France</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="India">India</option>
                  <option value="Germany">Germany</option>
                  <option value="China">China</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="South Korea">South Korea</option>
                </select>
                {errors.Country_of_Origin && (
                  <p className="text-red-500 text-xs mt-1">{errors.Country_of_Origin}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Import Quantity (kg) <span className="text-red-500">*</span></label>
                <Input
                  name="Import_Quantity (kg)"
                  value={formData["Import_Quantity (kg)"]}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  placeholder="Enter Quantity"
                  className={`w-full ${errors["Import_Quantity (kg)"] ? 'border-red-500' : ''}`}
                  required
                />
                {errors["Import_Quantity (kg)"] && (
                  <p className="text-red-500 text-xs mt-1">{errors["Import_Quantity (kg)"]}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Compliance History <span className="text-red-500">*</span></label>
                <select 
                  name="Compliance_History" 
                  value={formData.Compliance_History}
                  onChange={handleChange} 
                  className={`w-full h-10 px-3 py-2 border rounded-md ${errors.Compliance_History ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select Compliance History</option>
                  <option value="Good">Good</option>
                  <option value="Poor">Poor</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Average">Average</option>
                </select>
                {errors.Compliance_History && (
                  <p className="text-red-500 text-xs mt-1">{errors.Compliance_History}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Compliance Score (0-100) <span className="text-red-500">*</span></label>
                <Input
                  name="Compliance_Score"
                  value={formData.Compliance_Score}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter Score"
                  className={`w-full ${errors.Compliance_Score ? 'border-red-500' : ''}`}
                  required
                />
                {errors.Compliance_Score && (
                  <p className="text-red-500 text-xs mt-1">{errors.Compliance_Score}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Past Violations <span className="text-red-500">*</span></label>
                <Input
                  name="Past_Violations"
                  value={formData.Past_Violations}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  placeholder="Number of Violations"
                  className={`w-full ${errors.Past_Violations ? 'border-red-500' : ''}`}
                  required
                />
                {errors.Past_Violations && (
                  <p className="text-red-500 text-xs mt-1">{errors.Past_Violations}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Import Trend <span className="text-red-500">*</span></label>
                <Input
                  name="Import_Trend"
                  value={formData.Import_Trend}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter Import Trend"
                  className={`w-full ${errors.Import_Trend ? 'border-red-500' : ''}`}
                  required
                />
                {errors.Import_Trend && (
                  <p className="text-red-500 text-xs mt-1">{errors.Import_Trend}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Risk Category <span className="text-red-500">*</span></label>
                <select 
                  name="Risk_Category" 
                  value={formData.Risk_Category}
                  onChange={handleChange} 
                  className={`w-full p-2 border rounded-md ${errors.Risk_Category ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select Risk Category</option>
                  <option value="Not Risky">Not Risky</option>
                  <option value="Risky">Risky</option>
                </select>
                {errors.Risk_Category && (
                  <p className="text-red-500 text-xs mt-1">{errors.Risk_Category}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Financial Stability <span className="text-red-500">*</span></label>
                <select 
                  name="Financial_Stability" 
                  value={formData.Financial_Stability}
                  onChange={handleChange} 
                  className={`w-full p-2 border rounded-md ${errors.Financial_Stability ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select Financial Stability</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                {errors.Financial_Stability && (
                  <p className="text-red-500 text-xs mt-1">{errors.Financial_Stability}</p>
                )}
              </div>

              <div className="mt-2 text-xs text-gray-500">
                <p>All fields marked with <span className="text-red-500">*</span> are required</p>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-teal-400 to-teal-500">
                Analyze Trends
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="glass-card p-6 animate-slide-up">
              <div className="flex items-center gap-3 mb-6">
                <ChartLine className="w-6 h-6 text-teal-500" />
                <h2 className="text-xl font-semibold">Future Projections</h2>
              </div>
              <div className="space-y-6">
                {prediction ? (
                  <div
                    className={`flex items-center gap-2 p-4 rounded-lg border animate-fade-in transition-all duration-500
                      ${
                        prediction.toLowerCase().includes("increase")
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                  >
                    {prediction.toLowerCase().includes("increase") ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <p
                      className={`text-sm ${
                        prediction.toLowerCase().includes("increase") ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      Predicted Output: {prediction}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <p className="text-sm text-amber-700">
                      Complete all required fields to generate risk projections
                    </p>
                  </div>
                )}

                {/* Comparison Bar Chart */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Industry Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getComparisonData()} barGap={0} barCategoryGap="15%">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" scale="band" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <defs>
                        <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.3}/>
                        </linearGradient>
                        <linearGradient id="colorIndustry" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        </linearGradient>
                      </defs>
                      <Bar dataKey="Current" fill="url(#colorCurrent)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Industry" fill="url(#colorIndustry)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Future Trend Area Chart */}
                {prediction && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Projected Risk Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={generateRiskProjection()}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" 
                              stopColor={prediction.toLowerCase().includes("increase") ? "#ef4444" : "#22c55e"} 
                              stopOpacity={0.8}/>
                            <stop offset="95%" 
                              stopColor={prediction.toLowerCase().includes("increase") ? "#ef4444" : "#22c55e"} 
                              stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="risk" 
                          stroke={prediction.toLowerCase().includes("increase") ? "#dc2626" : "#16a34a"} 
                          fillOpacity={1} 
                          fill="url(#colorRisk)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureRisk;
