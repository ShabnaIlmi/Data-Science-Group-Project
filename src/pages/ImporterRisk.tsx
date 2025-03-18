import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ImporterRisk = () => {
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
  
  const complianceHistoryOptions = ["Excellent", "Good", "Average", "Poor"];
  
  const financialStabilityOptions = ["High", "Medium", "Low"];

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
            <form className="space-y-4">
              <div>
                <Input 
                  placeholder="Importer License ID" 
                  className="w-full" 
                />
              </div>
              
              {/* HS Code Dropdown */}
              <div>
                <Select>
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
                <Select>
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
                <Select>
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
                <Select>
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
                <Select>
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
                <Select>
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
                  placeholder="Import Volume (kg/L)" 
                  type="number" 
                  className="w-full" 
                />
              </div>
              
              <Button className="w-full bg-gradient-to-r from-teal-400 to-teal-500">
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
              <div className="text-center p-8">
                <p className="text-gray-500">Submit importer details to see risk assessment</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImporterRisk;