import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FlaskConical, AlertOctagon, Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";

interface ChemicalInput {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

interface FormValues {
  description: string;
  chemicals: ChemicalInput[];
}

const RecipeRisk = () => {
  const [riskResult, setRiskResult] = useState<{ risk_level: string; message: string } | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      description: "",
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

  const onSubmit = async (data: FormValues) => {
    console.log("Sending data to API:", data);
    setRiskResult(null); // Reset previous result

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("API Response:", result);
      setRiskResult({ risk_level: result.risk_level, message: result.message });
    } catch (error) {
      console.error("Error connecting to API:", error);
      setRiskResult({ risk_level: "Error", message: "Failed to analyze. Please try again." });
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

              <Button type="submit" className="w-full bg-gradient-to-r from-teal-400 to-teal-500">
                Analyze Combination
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
              {riskResult ? (
                <div className={`text-center p-8 rounded-md ${riskResult.risk_level === "High" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                  <h3 className="text-xl font-bold">Risk Level: {riskResult.risk_level}</h3>
                  <p className="mt-2">{riskResult.message}</p>
                </div>
              ) : (
                <div className="text-center p-8">
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
