import { Activity, Brain, Shield, TrendingUp, FlaskConical, Thermometer, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

const AboutUs = () => {
  const highlights = [
    {
      icon: <Brain className="w-8 h-8 text-teal-500" />,
      title: "AI-Powered Risk Prediction",
      description: "Utilizing advanced machine learning models to analyze chemical compositions and predict potential safety hazards."
    },
    {
      icon: <Activity className="w-8 h-8 text-teal-500" />,
      title: "Real-Time Data Processing",
      description: "Process and analyze chemical data instantly to assess and predict potential hazards before they arise."
    },
    {
      icon: <Shield className="w-8 h-8 text-teal-500" />,
      title: "Regulatory Compliance Support",
      description: "Stay compliant with international chemical safety regulations and standards for safer trade and usage."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-teal-500" />,
      title: "User-Friendly Interface",
      description: "Intuitive dashboards and reporting tools designed for seamless interaction and comprehensive risk assessment."
    }
  ];

  return (
    <div className="relative min-h-screen py-24 overflow-hidden bg-gradient-to-b from-white via-teal-50 to-blue-50">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-teal-300 opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-300 opacity-5 rounded-full blur-3xl"></div>
        
        {/* Molecular Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" viewBox="0 0 100 100">
          <pattern id="molecularPattern" patternUnits="userSpaceOnUse" width="30" height="30" patternTransform="rotate(45)">
            <circle cx="15" cy="15" r="2" fill="currentColor" />
            <path d="M15,15 L25,25 M15,15 L5,25 M15,15 L25,5 M15,15 L5,5" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#molecularPattern)" />
        </svg>
        
        {/* Floating Chemical Icons */}
        <div className="absolute top-20 left-20 text-teal-400 opacity-10 animate-float" style={{ animationDelay: '0s' }}>
          <FlaskConical className="w-24 h-24" />
        </div>
        <div className="absolute bottom-40 right-20 text-blue-400 opacity-10 animate-float" style={{ animationDelay: '2s' }}>
          <Thermometer className="w-32 h-32" />
        </div>
        <div className="absolute top-1/2 left-1/3 text-teal-500 opacity-5 animate-float" style={{ animationDelay: '4s' }}>
          <Zap className="w-40 h-40" />
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header Section */}
        <header className="text-center mb-20 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl shadow-lg">
              <FlaskConical className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Empowering Chemical Safety</span>
            <br /> with AI-Driven Intelligence
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced risk prediction and monitoring to ensure safer chemical handling across industries
          </p>
        </header>

        {/* Main Content Card */}
        <div className="max-w-4xl mx-auto mb-24">
          <Card className="p-10 bg-white/80 backdrop-blur-lg shadow-xl border border-white rounded-2xl">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
              <div className="flex-shrink-0">
                <div className="p-4 bg-teal-50 rounded-full">
                  <Shield className="w-12 h-12 text-teal-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              The Comprehensive Chemical Risk Prediction Model (CCRPM) is an advanced AI-driven platform designed to assess and predict the risks associated with chemical importation, end-user handling, and hazardous chemical combinations.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Inspired by the mission of the National Authority for the Implementation of the Chemical Weapons Convention (NACWC) of Sri Lanka, our goal is to enhance chemical monitoring and regulation to prevent misuse and ensure national safety. CCRPM leverages cutting-edge machine learning algorithms, historical data analysis, and risk assessment techniques to provide real-time insights, helping regulatory bodies and industries make informed decisions.
            </p>
          </Card>
        </div>

        {/* Highlights Section */}
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => (
            <Card 
              key={index} 
              className="bg-white/80 backdrop-blur-sm p-8 border border-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" 
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-teal-50 rounded-full mb-6">
                  {highlight.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{highlight.title}</h3>
                <p className="text-gray-600">{highlight.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Section */}
        <div className="mt-20 text-center">
          <Card className="bg-white/80 backdrop-blur-sm p-8 border border-white rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Advancing Chemical Safety Through Innovation
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ChemRisk AI combines cutting-edge artificial intelligence with comprehensive chemical data to create a safer world for researchers, regulators, and industries working with chemical substances.
            </p>
          </Card>
        </div>
      </div>

      {/* Add animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;
