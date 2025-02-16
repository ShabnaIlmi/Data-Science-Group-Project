
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface RiskCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  action: string;
  path: string;
}

const RiskCard = ({ title, description, icon, action, path }: RiskCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="glass-card p-6 transition-all duration-300 hover:scale-105 animate-fade-in flex flex-col h-full">
      <div className="flex flex-col items-center gap-4 flex-grow">
        <div className="text-3xl text-teal-500">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 text-center flex-grow">{description}</p>
        <button 
          onClick={() => navigate(path)}
          className="mt-auto px-6 py-2 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-full hover:opacity-90 transition-opacity w-full"
        >
          {action}
        </button>
      </div>
    </Card>
  );
};

export default RiskCard;
