import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrendingUp, ChartLine, AlertCircle } from "lucide-react";
import { Select } from "@/components/ui/select";

const FutureRisk = () => {
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
            <form className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Import Frequency</label>
                <Input 
                  placeholder="Enter Import Frequency" 
                  className="w-full" 
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Chemical Name</label>
                <Input 
                  placeholder="Enter Chemical Name" 
                  className="w-full" 
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Country of Origin</label>
                <Input 
                  placeholder="Enter Country" 
                  className="w-full" 
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Import Quantity</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input 
                      type="number"
                      placeholder="Enter Quantity" 
                      className="w-full" 
                    />
                  </div>
                  <div className="w-24">
                    <Select>
                      <select className="w-full h-10 px-3 py-2 border rounded-md">
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                      </select>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Compliance History</label>
                <Input 
                  placeholder="Enter Compliance History" 
                  className="w-full" 
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Compliance Score (0-100)</label>
                <Input 
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
                  type="number"
                  min="0"
                  placeholder="Number of Violations" 
                  className="w-full" 
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Import Trend</label>
                <Input 
                  placeholder="Enter Import Trend" 
                  className="w-full" 
                />
              </div>
              
              <Button className="w-full bg-gradient-to-r from-teal-400 to-teal-500">
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
              <div className="flex items-center gap-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <p className="text-sm text-amber-700">Complete the form to generate risk projections based on historical data</p>
              </div>
              <div className="text-center p-8">
                <p className="text-gray-500">Submit details to see future projections</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FutureRisk;