
import { FlaskConical, Users, Activity, TrendingUp } from "lucide-react";
import RiskCard from "@/components/RiskCard";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();

  const riskCards = [
    {
      title: "Importer Risk Prediction",
      description: "Analyze historical chemical import data to assess associated risks and patterns",
      icon: <FlaskConical className="w-8 h-8" />,
      action: "Analyze Risk",
      path: "/importer-risk",
      requiresAuth: false
    },
    {
      title: "End-User Prediction",
      description: "Evaluate chemical purchase patterns to determine potential misuse scenarios",
      icon: <Users className="w-8 h-8" />,
      action: "Explore Tools",
      path: "/end-user-risk",
      requiresAuth: false
    },
    {
      title: "Risk Analysis",
      description: "Identify hazardous chemical combinations and assess potential threats",
      icon: <Activity className="w-8 h-8" />,
      action: "Analyze Now",
      path: "/recipe-risk",
      requiresAuth: false
    },
    {
      title: "Future Risk Analysis",
      description: "Forecast potential risks based on historical import trends and patterns",
      icon: <TrendingUp className="w-8 h-8" />,
      action: "View Trends",
      path: "/future-risk",
      requiresAuth: false
    },
  ];

  return (
    <div className="hero-gradient">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">AI-Driven</span> Risk Prediction
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Advanced chemical risk prediction and analysis platform powered by artificial intelligence
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
          {riskCards.map((card, index) => (
            <div key={index} className="relative">
              <RiskCard {...card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
