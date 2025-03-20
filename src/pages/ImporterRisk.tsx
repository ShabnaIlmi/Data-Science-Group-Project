import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, AlertCircle } from "lucide-react";

const ImporterRisk = () => {
  // State to manage user inputs
  const [importerData, setImporterData] = useState({
    importerId: "",
    importFrequency: "",
    hsCode: "",
    chemicalName: "",
    countryOfOrigin: "",
    importationDescription: "",
    complianceHistory: "",
    financialStability: "",
    importVolume: ""
  });

  // State to manage response from Flask API
  const [riskData, setRiskData] = useState(null);

  // Data for dropdowns
  const hsCodeOptions = ["282619", "280700", "283711", "280800", "282611", "280120"];
  const chemicalNameOptions = [
    "Fluorides; fluorosilicates, fluoroaluminates, and other complex fluorine salts",
    "Sulphuric acid; oleum"
    // Add more options here
  ];
  const countryOfOriginOptions = ["Pakistan", "Brazil", "India", "China", "USA"];
  const importationDescriptionOptions = [
    "Used in aluminum smelting & glass manufacturing",
    "Petroleum refining & chemical synthesis"
    // Add more options here
  ];
  const complianceHistoryOptions = ["Excellent", "Good", "Average", "Poor"];
  const financialStabilityOptions = ["High", "Medium", "Low"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setImporterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e, field) => {
    const { value } = e.target;
    setImporterData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure all fields are filled out before submitting
    const missingFields = Object.keys(importerData).filter(key => !importerData[key]);
    
    if (missingFields.length > 0) {
      alert(`Please fill out the following fields: ${missingFields.join(", ")}`);
      return;
    }
  
    const dataToSend = {
      importerId: importerData.importerId,
      importFrequency: importerData.importFrequency,
      hsCode: importerData.hsCode,
      chemicalName: importerData.chemicalName,
      countryOfOrigin: importerData.countryOfOrigin,
      importationDescription: importerData.importationDescription,
      complianceHistory: importerData.complianceHistory,
      financialStability: importerData.financialStability,
      importVolume: importerData.importVolume
    };
  
    try {
      const response = await fetch("http://localhost:5000/importer-risk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      
      if (response.ok) {
        const result = await response.json();
        setRiskData(result);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Error sending data to Flask:", error);
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

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="glass-card p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-teal-500" />
              <h2 className="text-xl font-semibold">Importer Details</h2>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Input fields */}
              <div>
                <Input 
                  name="importerId" 
                  value={importerData.importerId} 
                  placeholder="Importer ID" 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <Input 
                  name="importFrequency" 
                  type="number" 
                  value={importerData.importFrequency} 
                  placeholder="Import Frequency"
                  onChange={handleChange} 
                />
              </div>
              
              {/* HS Code Dropdown */}
              <div>
                <Select onValueChange={(value) => handleSelectChange({ target: { value } }, 'hsCode')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="HS Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {hsCodeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Chemical Name Dropdown */}
              <div>
                <Select onValueChange={(value) => handleSelectChange({ target: { value } }, 'chemicalName')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chemical Name" />
                  </SelectTrigger>
                  <SelectContent>
                    {chemicalNameOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Country of Origin Dropdown */}
              <div>
                <Select onValueChange={(value) => handleSelectChange({ target: { value } }, 'countryOfOrigin')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Country of Origin" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOfOriginOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Importation Description Dropdown */}
              <div>
                <Select onValueChange={(value) => handleSelectChange({ target: { value } }, 'importationDescription')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Importation Description" />
                  </SelectTrigger>
                  <SelectContent>
                    {importationDescriptionOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Compliance History Dropdown */}
              <div>
                <Select onValueChange={(value) => handleSelectChange({ target: { value } }, 'complianceHistory')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Compliance History" />
                  </SelectTrigger>
                  <SelectContent>
                    {complianceHistoryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Financial Stability Dropdown */}
              <div>
                <Select onValueChange={(value) => handleSelectChange({ target: { value } }, 'financialStability')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Financial Stability" />
                  </SelectTrigger>
                  <SelectContent>
                    {financialStabilityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Input 
                  name="importVolume" 
                  placeholder="Import Volume (kg/L)" 
                  type="number" 
                  value={importerData.importVolume}
                  onChange={handleChange} 
                  className="w-full" 
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-teal-400 to-teal-500" type="submit">
                Analyze Risk
              </Button>
            </form>
          </Card>

          <Card className="glass-card p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-teal-500" />
              <h2 className="text-xl font-semibold">Risk Assessment</h2>
            </div>
            <div className="space-y-6">
              {riskData ? (
                <div className="text-center p-8">
                  <p className="text-gray-500">Risk Category: {riskData.risk_category}</p>
                  <p className="text-gray-500">Risk Probability: {riskData.risk_probability}</p>
                </div>
              ) : (
                <p className="text-gray-500">Submit importer details to see risk assessment</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImporterRisk;
