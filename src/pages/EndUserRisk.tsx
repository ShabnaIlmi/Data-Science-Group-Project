import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, BarChart2, Calendar, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const EndUserRisk = () => {
  const [date, setDate] = useState(null);
  const [formData, setFormData] = useState({
    customerName: "",
    chemicalName: "",
    quantity: "",
    unit: "gram",
  });
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUnitChange = (value) => {
    setFormData(prev => ({
      ...prev,
      unit: value
    }));
  };

  const handleAnalyze = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Calculate a pseudo-random risk score based on form data
      const nameLength = formData.customerName.length || 1;
      const chemLength = formData.chemicalName.length || 1;
      const quantity = parseInt(formData.quantity) || 1;
      
      const calculatedRisk = ((nameLength * chemLength * quantity) % 85) + 15;
      setRiskScore(calculatedRisk);
      setHasAnalyzed(true);
      setIsLoading(false);
    }, 1200);
  };

  const getRiskLevel = () => {
    if (riskScore < 30) return { level: "Low", color: "text-green-500", bg: "bg-green-100" };
    if (riskScore < 70) return { level: "Medium", color: "text-yellow-500", bg: "bg-yellow-100" };
    return { level: "High", color: "text-red-500", bg: "bg-red-100" };
  };

  const risk = getRiskLevel();

  return (
    <div className="min-h-screen hero-gradient py-16">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">End-User</span> Risk Analysis
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Evaluate chemical purchase patterns to determine potential misuse scenarios
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="glass-card p-6 animate-slide-up shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-teal-500" />
              <h2 className="text-xl font-semibold">Purchase Analysis</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Customer Name</label>
                <Input 
                  placeholder="Enter customer name" 
                  className="w-full" 
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Chemical Name</label>
                <Input 
                  placeholder="Enter chemical name" 
                  className="w-full" 
                  name="chemicalName"
                  value={formData.chemicalName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">Quantity</label>
                  <Input 
                    placeholder="Enter quantity" 
                    className="w-full" 
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-32">
                  <label className="text-sm font-medium mb-1 block">Unit</label>
                  <Select value={formData.unit} onValueChange={handleUnitChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gram">g</SelectItem>
                      <SelectItem value="kilogram">kg</SelectItem>
                      <SelectItem value="liter">L</SelectItem>
                      <SelectItem value="milliliter">mL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Purchase Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select Purchase Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="mt-6">
                <Button 
                  className="w-full bg-gradient-to-r from-teal-400 to-teal-500"
                  onClick={handleAnalyze}
                  disabled={isLoading}
                >
                  {isLoading ? "Analyzing..." : "Analyze Patterns"}
                </Button>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 animate-slide-up shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <BarChart2 className="w-6 h-6 text-teal-500" />
              <h2 className="text-xl font-semibold">Risk Assessment</h2>
            </div>
            
            {!hasAnalyzed ? (
              <div className="text-center p-12">
                <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Submit end-user details to see risk assessment</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center p-4">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 ${risk.bg}`}>
                    <span className={`text-4xl font-bold ${risk.color}`}>{riskScore}</span>
                  </div>
                  <Badge className={`${risk.bg} ${risk.color} border-0 text-md px-4 py-1`}>
                    {risk.level} Risk
                  </Badge>
                  <p className="mt-4 text-gray-600 text-center">
                    This customer's purchasing pattern shows a {risk.level.toLowerCase()} risk profile based on quantity, frequency, and chemical types.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">Risk Indicators</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Purchase Volume</span>
                      <span className="text-sm font-medium">{Math.min(riskScore + 10, 100)}%</span>
                    </div>
                    <Progress value={Math.min(riskScore + 10, 100)} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Purchase Frequency</span>
                      <span className="text-sm font-medium">{Math.min(riskScore - 5, 100)}%</span>
                    </div>
                    <Progress value={Math.min(riskScore - 5, 100)} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Unusual Combinations</span>
                      <span className="text-sm font-medium">{Math.min(riskScore + 20, 100)}%</span>
                    </div>
                    <Progress value={Math.min(riskScore + 20, 100)} className="h-2" />
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-orange-50 rounded-md border border-orange-100">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 mr-2" />
                    <div>
                      <h4 className="font-medium text-orange-800">Recommended Actions</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        Consider additional verification for this customer based on unusual purchase patterns of {formData.chemicalName || "specified chemicals"}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EndUserRisk;
