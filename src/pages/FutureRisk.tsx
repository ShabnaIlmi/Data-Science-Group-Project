import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select,} from "@/components/ui/select";


import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,   LineChart,  Line} from "recharts";
import { ChartLine, AlertCircle, ArrowUpRight, ArrowDownRight, TrendingUp} from "lucide-react";
import { CheckCircle, XCircle } from "lucide-react";




const FutureRisk = () => {
  const [formData, setFormData] = useState({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([formData])
      });

      const data = await response.json();
      setPrediction(data.predicted_risk);
    } catch (error) {
      console.error("Prediction error:", error);
      setPrediction("Error generating prediction.");
    }
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
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Import Frequency</label>
                <Input
                  name="Import_Frequency"
                  onChange={handleChange}
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Import Frequency"
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Chemical Name</label>
                <select name="Chemical_Name" onChange={handleChange} className="w-full p-2 border rounded-md">
                  <option value="">Select Chemical Name</option>
                  <option value="Bromine">Bromine</option>
                  <option value="Fluorides">Fluorides</option>
                  <option value="Chlorine">Chlorine</option>
                  <option value="Cyanides">Cyanides</option>
                  <option value="Iodine">Iodine</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Country of Origin</label>
                <select name="Country_of_Origin" onChange={handleChange} className="w-full p-2 border rounded-md">
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
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Import Quantity (kg)</label>
                <Input
                  name="Import_Quantity (kg)"
                  onChange={handleChange}
                  type="number"
                  min="0"
                  placeholder="Enter Quantity"
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Compliance History</label>
                <select name="Compliance_History" onChange={handleChange} className="w-full h-10 px-3 py-2 border rounded-md">
                  <option value="">Select Compliance History</option>
                  <option value="Good">Good</option>
                  <option value="Poor">Poor</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Average">Average</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Compliance Score (0-100)</label>
                <Input
                  name="Compliance_Score"
                  onChange={handleChange}
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter Score"
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Past Violations</label>
                <Input
                  name="Past_Violations"
                  onChange={handleChange}
                  type="number"
                  min="0"
                  placeholder="Number of Violations"
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Import Trend</label>
                <Input
                  name="Import_Trend"
                  onChange={handleChange}
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter Import Trend"
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Risk Category</label>
                <select name="Risk_Category" onChange={handleChange} className="w-full p-2 border rounded-md">
                  <option value="">Select Risk Category</option>
                  <option value="Not Risky">Not Risky</option>
                  <option value="Risky">Risky</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Financial Stability</label>
                <select name="Financial_Stability" onChange={handleChange} className="w-full p-2 border rounded-md">
                  <option value="">Select Financial Stability</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-teal-400 to-teal-500">
                Analyze Trends
              </Button>
            </form>
          </Card>

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
      Complete the form to generate risk projections based on historical data
    </p>
  </div>
)}


{/* Enhanced Chart section */}
<div className="p-4">
  {/* MAIN BAR CHART */}
  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={[
        { name: "Frequency", value: parseFloat(formData["Import_Frequency"]) || 0 },
        { name: "Quantity", value: parseFloat(formData["Import_Quantity (kg)"]) || 0 },
        { name: "Score", value: parseFloat(formData["Compliance_Score"]) || 0 },
        { name: "Violations", value: parseFloat(formData["Past_Violations"]) || 0 },
        { name: "Trend", value: parseFloat(formData["Import_Trend"]) || 0 }
      ]}
      barCategoryGap={10}
    >
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#0f766e" stopOpacity={0.9} />
        </linearGradient>
      </defs>
      <XAxis dataKey="name" stroke="#888" />
      <YAxis stroke="#888" />
      <Tooltip />
      <Bar
        dataKey="value"
        fill="url(#barGradient)"
        radius={[10, 10, 0, 0]}
        animationDuration={1000}
      />
    </BarChart>
  </ResponsiveContainer>

  {/* TREND LINE CHART (BASED ON PREDICTION) */}
  {prediction && (
    <div className="mt-10">
      

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={
            prediction.toLowerCase().includes("increase")
              ? [
                  { x: 1, y: 15 },
                  { x: 2, y: 30 },
                  { x: 3, y: 50 },
                  { x: 4, y: 80 },
                  { x: 5, y: 100 }
                ]
              : [
                  { x: 1, y: 100 },
                  { x: 2, y: 85 },
                  { x: 3, y: 60 },
                  { x: 4, y: 35 },
                  { x: 5, y: 20 }
                ]
          }
        >
          <XAxis
            dataKey="x"
            stroke="#ccc"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#ccc" }}
          />
          <YAxis
            stroke="#ccc"
            tick={false}
            tickLine={false}
            axisLine={{ stroke: "#ccc" }}
          />
          {/* Removed Tooltip */}
          <Line
            type="monotone"
            dataKey="y"
            stroke={prediction.toLowerCase().includes("increase") ? "#16a34a" : "#dc2626"}
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
      <h3 className="text-center text-sm text-gray-500 mb-2">Projected Trend</h3>
    </div>
    
  )}
</div>


  </div>
</Card>

        </div>
      </div>
    </div>
  );
};

export default FutureRisk;
