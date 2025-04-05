
import { Activity, Brain, Shield, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const AboutUs = () => {
  const highlights = [
    {
      icon: <Brain className="w-6 h-6 text-teal-500" />,
      title: "AI-Powered Risk Prediction",
      description: "Utilizing ML models for chemical safety analysis."
    },
    {
      icon: <Activity className="w-6 h-6 text-teal-500" />,
      title: "Real-Time Data Processing",
      description: "Instantly assess and predict potential hazards."
    },
    {
      icon: <Shield className="w-6 h-6 text-teal-500" />,
      title: "Regulatory Compliance Support",
      description: "Ensuring safer chemical trade and usage."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-teal-500" />,
      title: "User-Friendly Interface",
      description: "Designed for seamless interaction and risk reporting."
    }
  ];

  return (
    <div className="hero-gradient min-h-screen py-16">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Empowering Chemical Safety</span> with AI-Driven Intelligence
          </h1>
        </header>

        <div className="max-w-4xl mx-auto mb-16">
          <Card className="glass-card p-8">
            <p className="text-gray-600 text-lg leading-relaxed">
              The Comprehensive Chemical Risk Prediction Model (CCRPM) is an advanced AI-driven platform designed to assess and predict the risks associated with chemical importation, end-user handling, and hazardous chemical combinations. Inspired by the mission of the National Authority for the Implementation of the Chemical Weapons Convention (NACWC) of Sri Lanka, our goal is to enhance chemical monitoring and regulation to prevent misuse and ensure national safety. CCRPM leverages cutting-edge machine learning algorithms, historical data analysis, and risk assessment techniques to provide real-time insights, helping regulatory bodies and industries make informed decisions.
            </p>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((highlight, index) => (
            <Card key={index} className="glass-card p-6 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex flex-col items-center text-center">
                {highlight.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2">{highlight.title}</h3>
                <p className="text-gray-600">{highlight.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
