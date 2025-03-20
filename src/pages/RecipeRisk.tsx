import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, useFieldArray } from "react-hook-form";
import { FlaskConical, AlertOctagon, Plus, Trash2, Info } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define more explicit color values - removing any array structure that might cause issues
const riskColors = {
  "Low": "#4CAF50", // Green
  "Medium": "#FFC107", // Yellow
  "High": "#FF9800", // Orange
  "Very High": "#F44336", // Red
};

const riskBackgrounds = {
  "Low": "bg-green-100 text-green-800",
  "Medium": "bg-yellow-100 text-yellow-800",
  "High": "bg-orange-100 text-orange-800",
  "Very High": "bg-red-100 text-red-800",
};

interface FormValues {
  chemicals: { id: string; name: string; quantity: string; unit: string }[];
}

interface RiskResult {
  risk_level: string;
  explosiveness: number;
  health_risk: number;
  risk_score: number;
  explanation?: {
    main_factors: string[];
    risky_combinations?: string[];
    recommendations?: string[];
  };
}

const RecipeRisk = () => {
  const [riskResult, setRiskResult] = useState<RiskResult | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      chemicals: [{ id: crypto.randomUUID(), name: "", quantity: "", unit: "g" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "chemicals" });

  const addChemical = () => append({ id: crypto.randomUUID(), name: "", quantity: "", unit: "g" });

  const removeChemical = (index: number) => {
    if (fields.length > 1) remove(index);
  };

  const onSubmit = async (data: FormValues) => {
    console.log("Sending data to API:", data);
    setRiskResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("API Response:", result);

      setRiskResult({
        risk_level: result.overall_risk_level,
        explosiveness: parseFloat(result.explosiveness),
        health_risk: parseFloat(result.health_risk),
        risk_score: parseFloat(result.risk_score),
        explanation: result.explanation || {
          main_factors: [
            "Based on the chemical properties of the components",
            "Relative concentrations of reactive substances",
            "Known interaction profiles from safety databases"
          ],
          risky_combinations: result.risky_combinations || [],
          recommendations: result.recommendations || []
        }
      });
    } catch (error) {
      console.error("Error connecting to API:", error);
      setRiskResult(null);
    }
  };

  // Function to get color based on risk level and metric
  const getMetricColor = (value: number, riskLevel: string) => {
    const baseColor = riskColors[riskLevel] || "#000000";
    
    // Explosiveness - low values are safer
    if (value < 3) return "#4CAF50"; // Low - Green
    if (value < 5) return "#FFC107"; // Medium - Yellow
    if (value < 7) return "#FF9800"; // High - Orange
    return "#F44336"; // Very High - Red
  };

  return (
    <div className="min-h-screen hero-gradient py-16">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold">
            <span className="gradient-text">Recipe</span> Risk Analysis
          </h1>
          <p className="text-gray-600 text-lg">Identify hazardous chemical combinations</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Chemical Input Form */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <FlaskConical className="w-6 h-6 text-teal-500" />
              <h2 className="text-xl font-semibold">Chemical Combination</h2>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Chemicals</h3>
                  <Button type="button" onClick={addChemical} variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                    Add Chemical
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-gray-200 rounded-md space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Chemical {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button type="button" onClick={() => removeChemical(index)} variant="ghost" size="sm" className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium">Chemical Name</label>
                      <Input placeholder="e.g., Sodium Hydroxide" {...form.register(`chemicals.${index}.name`)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Quantity</label>
                        <Input placeholder="Amount" {...form.register(`chemicals.${index}.quantity`)} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Unit</label>
                        <select className="w-full rounded-md border px-3 py-2" {...form.register(`chemicals.${index}.unit`)}>
                          <option value="g">g</option>
                          <option value="mg">mg</option>
                          <option value="kg">kg</option>
                          <option value="mL">mL</option>
                          <option value="L">L</option>
                          <option value="mol">mol</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full bg-teal-500">
                Analyze Combination
              </Button>
            </form>
          </Card>

          {/* Hazard Assessment */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <AlertOctagon className="w-6 h-6 text-teal-500" />
                <h2 className="text-xl font-semibold">Hazard Assessment</h2>
              </div>

              {riskResult ? (
                <div className="space-y-6">
                  <div className={`p-4 rounded-md ${riskBackgrounds[riskResult.risk_level]}`}>
                    <h3 className="text-lg font-semibold">
                      Risk Level: {riskResult.risk_level}
                    </h3>
                  </div>

                  <Bar
                    data={{
                      labels: ["Explosiveness", "Health Risk", "Risk Score"],
                      datasets: [
                        {
                          label: "Risk Analysis",
                          data: [riskResult.explosiveness, riskResult.health_risk, riskResult.risk_score],
                          backgroundColor: [
                            getMetricColor(riskResult.explosiveness, riskResult.risk_level),
                            getMetricColor(riskResult.health_risk, riskResult.risk_level),
                            riskColors[riskResult.risk_level]
                          ],
                          barPercentage: 0.7,
                          borderWidth: 1,
                          borderColor: '#333',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: { 
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              let label = context.dataset.label || '';
                              if (label) {
                                label += ': ';
                              }
                              label += context.parsed.y.toFixed(2);
                              return label;
                            }
                          }
                        }
                      },
                      scales: { 
                        y: { 
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Risk Level (0-10)'
                          },
                          max: 10
                        },
                        x: {
                          grid: {
                            display: false
                          }
                        } 
                      },
                    }}
                  />
                </div>
              ) : (
                <p className="text-gray-500 text-center p-8">Submit chemical details to see hazard assessment</p>
              )}
            </Card>

            {/* Explainable AI Section */}
            {riskResult && (
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Info className="w-6 h-6 text-teal-500" />
                  <h2 className="text-xl font-semibold">Risk Explanation</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Main Factors</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {riskResult.explanation?.main_factors.map((factor, index) => (
                        <li key={index} className="text-gray-700">{factor}</li>
                      ))}
                    </ul>
                  </div>

                  {riskResult.explanation?.risky_combinations && 
                   riskResult.explanation.risky_combinations.length > 0 && (
                    <div>
                      <h3 className="font-medium text-lg mb-2">Risky Combinations</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {riskResult.explanation.risky_combinations.map((combo, index) => (
                          <li key={index} className="text-gray-700">{combo}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {riskResult.explanation?.recommendations && 
                   riskResult.explanation.recommendations.length > 0 && (
                    <div>
                      <h3 className="font-medium text-lg mb-2">Safety Recommendations</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {riskResult.explanation.recommendations.map((rec, index) => (
                          <li key={index} className="text-gray-700">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeRisk;