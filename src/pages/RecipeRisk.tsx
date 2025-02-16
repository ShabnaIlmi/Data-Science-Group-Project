
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FlaskConical, AlertOctagon } from "lucide-react";

const RecipeRisk = () => {
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
          <Card className="glass-card p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <FlaskConical className="w-6 h-6 text-teal-500" />
              <h2 className="text-xl font-semibold">Chemical Combination</h2>
            </div>
            <form className="space-y-4">
              <div>
                <Input 
                  placeholder="Chemical 1" 
                  className="w-full" 
                />
              </div>
              <div>
                <Input 
                  placeholder="Chemical 2" 
                  className="w-full" 
                />
              </div>
              <div>
                <Input 
                  placeholder="Quantities (in g/mL)" 
                  className="w-full" 
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-teal-400 to-teal-500">
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
    </div>
  );
};

export default RecipeRisk;
