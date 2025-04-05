import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FlaskConical, AlertOctagon, Plus, Trash2, Info, AlertTriangle, AlertCircle } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";

interface ChemicalInput {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

interface FormValues {
  chemicals: ChemicalInput[];
}

interface RiskResult {
  explosiveness: number;
  health_risk: number;
  risk_score: number;
  overall_risk_level: string;
}

const RecipeRisk = () => {
  const [riskResult, setRiskResult] = useState<RiskResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      chemicals: [
        {
          id: crypto.randomUUID(),
          name: "",
          quantity: "",
          unit: "g",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "chemicals",
  });

  const addChemical = () => {
    append({
      id: crypto.randomUUID(),
      name: "",
      quantity: "",
      unit: "g",
    });
  };

  const removeChemical = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Get the appropriate styles based on risk level
  const getRiskStyles = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case "very high risk":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          borderColor: "border-red-300",
          icon: <AlertCircle className="w-12 h-12 text-red-500" />
        };
      case "high risk":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          borderColor: "border-red-300",
          icon: <AlertCircle className="w-12 h-12 text-red-500" />
        };
      case "medium risk":
        return {
          bgColor: "bg-orange-100",
          textColor: "text-orange-700",
          borderColor: "border-orange-300",
          icon: <AlertTriangle className="w-12 h-12 text-orange-500" />
        };
      case "low risk":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          borderColor: "border-green-300",
          icon: <Info className="w-12 h-12 text-green-500" />
        };
      default:
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
          borderColor: "border-blue-300",
          icon: <Info className="w-12 h-12 text-blue-500" />
        };
    }
  };

  // Get color based on numerical value (0-100)
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-red-600";
    if (score >= 30) return "text-orange-600";
    return "text-green-600";
  };

  // Get width percentage for progress bar
  const getProgressWidth = (score: number) => {
    return `${Math.min(100, Math.max(0, score))}%`;
  };

  const onSubmit = async (data: FormValues) => {
    console.log("Sending data to API:", data);
    setIsLoading(true);
    setRiskResult(null);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setRiskResult({
        explosiveness: result.explosiveness,
        health_risk: result.health_risk,
        risk_score: result.risk_score,
        overall_risk_level: result.overall_risk_level
      });
    } catch (error) {
      console.error("Error connecting to API:", error);
      setError("Failed to analyze. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient py-16">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Recipe</span> Risk Analysis
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Identify hazardous chemical combinations and assess potential threats
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Chemical Combination Form */}
          <Card className="glass-card p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <FlaskConical className="w-6 h-6 text-teal-500" />
              <h2 className="text-xl font-semibold">Chemical Combination</h2>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Chemicals</h3>
                  <Button type="button" onClick={addChemical} variant="outline" size="sm" className="flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    Add Chemical
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-gray-200 rounded-md space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Chemical {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button type="button" onClick={() => removeChemical(index)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div>
                      <label htmlFor={`chemicals.${index}.name`} className="text-sm font-medium">
                        Chemical Name
                      </label>
                      <Input id={`chemicals.${index}.name`} placeholder="e.g., Sodium Hydroxide" className="w-full" {...form.register(`chemicals.${index}.name`)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`chemicals.${index}.quantity`} className="text-sm font-medium">
                          Quantity
                        </label>
                        <Input id={`chemicals.${index}.quantity`} placeholder="Amount" className="w-full" {...form.register(`chemicals.${index}.quantity`)} />
                      </div>
                      <div>
                        <label htmlFor={`chemicals.${index}.unit`} className="text-sm font-medium">
                          Unit
                        </label>
                        <select
                          id={`chemicals.${index}.unit`}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                          {...form.register(`chemicals.${index}.unit`)}
                        >
                          <option value="g">g (grams)</option>
                          <option value="mg">mg (milligrams)</option>
                          <option value="kg">kg (kilograms)</option>
                          <option value="mL">mL (milliliters)</option>
                          <option value="L">L (liters)</option>
                          <option value="mol">mol (moles)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-teal-400 to-teal-500"
                disabled={isLoading}
              >
                {isLoading ? "Analyzing..." : "Analyze Combination"}
              </Button>
            </form>
          </Card>

          {/* Hazard Assessment Card */}
          <Card className="glass-card p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <AlertOctagon className="w-6 h-6 text-teal-500" />
              <h2 className="text-xl font-semibold">Hazard Assessment</h2>
            </div>

            <div className="space-y-6">
              {error ? (
                <div className="p-6 rounded-md border bg-red-50 text-red-700 border-red-200 text-center">
                  <AlertOctagon className="w-8 h-8 text-red-500 mx-auto mb-3" />
                  <p>{error}</p>
                </div>
              ) : isLoading ? (
                <div className="text-center p-8 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex flex-col items-center justify-center h-48">
                    <div className="h-10 w-10 border-4 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500">Analyzing chemical combination...</p>
                  </div>
                </div>
              ) : riskResult ? (
                (() => {
                  const styles = getRiskStyles(riskResult.overall_risk_level);
                  return (
                    <div className={`p-6 rounded-md border ${styles.bgColor} ${styles.borderColor}`}>
                      <div className="flex flex-col items-center text-center mb-6">
                        {styles.icon}
                        <h3 className={`text-xl font-bold mt-3 ${styles.textColor}`}>
                          {riskResult.overall_risk_level}
                        </h3>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Explosiveness Score */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Explosiveness</span>
                            <span className={`text-sm font-bold ${getScoreColor(riskResult.explosiveness)}`}>
                              {riskResult.explosiveness.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-red-500 h-2.5 rounded-full" 
                              style={{ width: getProgressWidth(riskResult.explosiveness) }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Health Risk Score */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Health Risk</span>
                            <span className={`text-sm font-bold ${getScoreColor(riskResult.health_risk)}`}>
                              {riskResult.health_risk.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-red-500 h-2.5 rounded-full" 
                              style={{ width: getProgressWidth(riskResult.health_risk) }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Overall Risk Score */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Overall Risk</span>
                            <span className={`text-sm font-bold ${getScoreColor(riskResult.risk_score)}`}>
                              {riskResult.risk_score.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-red-500 h-2.5 rounded-full" 
                              style={{ width: getProgressWidth(riskResult.risk_score) }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-white bg-opacity-50 rounded-md border border-gray-200">
                        <h4 className="font-medium mb-2 text-gray-800">Safety Recommendation:</h4>
                        <p className="text-sm text-gray-700">
                          {riskResult.overall_risk_level.toLowerCase().includes("high") ? 
                            "This chemical combination is potentially hazardous. Professional handling with proper safety equipment is strongly recommended." : 
                            riskResult.overall_risk_level.toLowerCase().includes("medium") ?
                            "Exercise caution when handling this combination. Use appropriate safety equipment and follow proper procedures." :
                            "This combination appears relatively safe, but always follow standard laboratory safety protocols."}
                        </p>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-500">Submit chemical details to see hazard assessment</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecipeRisk;
