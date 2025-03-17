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
  const form = useForm<FormValues>({
    defaultValues: {
      description: "",
      chemicals: [{
        id: crypto.randomUUID(),
        name: "",
        quantity: "",
        unit: "g"
      }]
    }
  });
  const {
    fields,
    append,
    remove
  } = useFieldArray({
    control: form.control,
    name: "chemicals"
  });
  const addChemical = () => {
    append({
      id: crypto.randomUUID(),
      name: "",
      quantity: "",
      unit: "g"
    });
  };
  const removeChemical = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };
  const onSubmit = (data: FormValues) => {
    console.log("Analyzing recipe:", data);
    // In a real application, you would send this data to an API
  };
  return <div className="min-h-screen hero-gradient py-16">
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

                {fields.map((field, index) => <div key={field.id} className="p-4 border border-gray-200 rounded-md space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Chemical {index + 1}</h4>
                      {fields.length > 1 && <Button type="button" onClick={() => removeChemical(index)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>}
                    </div>
                    
                    <div>
                      <label htmlFor={`chemicals.${index}.name`} className="text-sm font-medium">Chemical Name</label>
                      <Input id={`chemicals.${index}.name`} placeholder="e.g., Sodium Hydroxide" className="w-full" {...form.register(`chemicals.${index}.name`)} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`chemicals.${index}.quantity`} className="text-sm font-medium">Quantity</label>
                        <Input id={`chemicals.${index}.quantity`} placeholder="Amount" className="w-full" {...form.register(`chemicals.${index}.quantity`)} />
                      </div>
                      <div>
                        <label htmlFor={`chemicals.${index}.unit`} className="text-sm font-medium">Unit</label>
                        <select id={`chemicals.${index}.unit`} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" {...form.register(`chemicals.${index}.unit`)}>
                          <option value="g">g (grams)</option>
                          <option value="mg">mg (milligrams)</option>
                          <option value="kg">kg (kilograms)</option>
                          <option value="mL">mL (milliliters)</option>
                          <option value="L">L (liters)</option>
                          <option value="mol">mol (moles)</option>
                        </select>
                      </div>
                    </div>
                  </div>)}
              </div>
              
              <Button type="submit" className="w-full bg-gradient-to-r from-teal-400 to-teal-500">
                Analyze Combination
              </Button>
            </form>
          </Card>

          <Card className="glass-card p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <AlertOctagon className="w-6 h-6 text-teal-500" />
              <h2 className="text-xl font-semibold">Hazard Assessment</h2>
            </div>
            <div className="space-y-6">
              <div className="text-center p-8">
                <p className="text-gray-500">Submit chemical details to see hazard assessment</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>;
};
export default RecipeRisk;