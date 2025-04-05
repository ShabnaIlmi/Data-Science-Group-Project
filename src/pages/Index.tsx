import { 
  FlaskConical, 
  Users, 
  Activity, 
  TrendingUp, 
  Beaker, 
  TestTube, 
  Atom
} from "lucide-react";
import RiskCard from "@/components/RiskCard";
import { useAuth } from "@/contexts/AuthContext";
import BenzeneRing from "@/components/BenzeneRing";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate loading effect
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  // Autoplay effect for carousel
  useEffect(() => {
    if (!api) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Change slide every 5 seconds
    
    // Reset interval when slide changes manually
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    
    // Cleanup
    return () => {
      clearInterval(interval);
      api.off("select", onSelect);
    };
  }, [api]);

  // For looping effect
  useEffect(() => {
    if (!api) return;
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
    
    api.on("reInit", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const riskCards = [
    {
      title: "Importer Risk Prediction",
      description: "Analyze historical chemical import data to assess associated risks and patterns",
      icon: <FlaskConical className="w-8 h-8" />,
      action: "Analyze Risk",
      path: "/importer-risk",
      requiresAuth: true,
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "End-User Prediction",
      description: "Evaluate chemical purchase patterns to determine potential misuse scenarios",
      icon: <Users className="w-8 h-8" />,
      action: "Explore Tools",
      path: "/end-user-risk",
      requiresAuth: true,
      color: "from-teal-500 to-green-600"
    },
    {
      title: "Recipe Risk Analysis",
      description: "Identify hazardous chemical combinations and assess potential threats",
      icon: <TestTube className="w-8 h-8" />,
      action: "Analyze Now",
      path: "/recipe-risk",
      requiresAuth: true,
      color: "from-amber-500 to-red-600"
    },
    {
      title: "Future Risk Analysis",
      description: "Forecast potential risks based on historical import trends and patterns",
      icon: <Atom className="w-8 h-8" />,
      action: "View Trends",
      path: "/future-risk",
      requiresAuth: true,
      color: "from-indigo-500 to-violet-600"
    },
  ];

  const carouselImages = [
    {
      url: "/api/placeholder/2000/800",
      caption: "Advanced Laboratory Analysis",
      description: "Cutting-edge techniques for chemical composition analysis"
    },
    {
      url: "/api/placeholder/2000/800",
      caption: "Chemical Research and Development",
      description: "Innovative approaches to chemical safety and risk assessment"
    },
    {
      url: "/api/placeholder/2000/800",
      caption: "Safety and Risk Management",
      description: "Comprehensive solutions for chemical hazard identification"
    },
    {
      url: "/api/placeholder/2000/800",
      caption: "Cutting-Edge Technologies",
      description: "Leveraging AI and machine learning for enhanced prediction"
    },
  ];

  const bubbles = [
    { size: "w-32 h-32", position: "top-40 left-1/4", delay: "animation-delay-500", opacity: "opacity-30" },
    { size: "w-24 h-24", position: "top-60 right-1/4", delay: "animation-delay-1000", opacity: "opacity-20" },
    { size: "w-16 h-16", position: "bottom-40 left-1/3", delay: "animation-delay-2000", opacity: "opacity-25" },
    { size: "w-20 h-20", position: "top-24 right-1/3", delay: "animation-delay-1500", opacity: "opacity-15" },
    { size: "w-28 h-28", position: "bottom-24 right-1/4", delay: "animation-delay-700", opacity: "opacity-20" },
  ];

  const benzeneRings = [
    { size: 60, position: "top-20 left-20", color: "rgba(139, 92, 246, 0.3)", rotationSpeed: 60 },
    { size: 80, position: "top-40 right-32", color: "rgba(14, 165, 233, 0.3)", rotationSpeed: 80 },
    { size: 50, position: "bottom-24 left-1/4", color: "rgba(16, 185, 129, 0.3)", rotationSpeed: 50 },
    { size: 70, position: "bottom-40 right-20", color: "rgba(236, 72, 153, 0.3)", rotationSpeed: 70 },
    { size: 55, position: "top-96 left-1/3", color: "rgba(245, 158, 11, 0.3)", rotationSpeed: 90 },
    { size: 45, position: "bottom-80 right-1/3", color: "rgba(6, 182, 212, 0.3)", rotationSpeed: 65 },
  ];

  const handleCardHover = (index) => {
    setHoveredCard(index);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden pb-16 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      {/* Hero Carousel Section */}
      <section className="relative w-full h-[50vh] mb-12">
        <Carousel 
          className="w-full h-full rounded-b-lg shadow-xl" 
          setApi={setApi}
          opts={{
            loop: true,
            align: "start",
          }}
        >
          <CarouselContent className="h-full">
            {carouselImages.map((image, index) => (
              <CarouselItem key={index} className="h-full">
                <div 
                  className="w-full h-full bg-cover bg-center relative overflow-hidden"
                  style={{ backgroundImage: `url('${image.url}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70 backdrop-blur-sm"></div>
                  <div className="absolute bottom-12 left-12 text-white max-w-xl transform transition-all duration-500 ease-in-out translate-y-0">
                    <h2 className="text-3xl font-bold mb-2">{image.caption}</h2>
                    <p className="text-lg text-gray-200">{image.description}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Custom carousel controls */}
          <div className="absolute bottom-6 right-8 z-10 flex gap-3">
            <CarouselPrevious className="relative left-0 bg-white/20 hover:bg-white/40 transition-all duration-300" />
            <CarouselNext className="relative right-0 bg-white/20 hover:bg-white/40 transition-all duration-300" />
          </div>
          
          {/* Carousel indicators */}
          <div className="absolute bottom-6 left-8 z-10 flex gap-2">
            {carouselImages.map((_, index) => (
              <button
                key={`indicator-${index}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  current === index ? "bg-white scale-110" : "bg-white/40 hover:bg-white/60"
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </section>

      {/* Decorative elements */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0 pointer-events-none"></div>

      {benzeneRings.map((ring, index) => (
        <div 
          key={`benzene-${index}`} 
          className={`absolute ${ring.position} hidden lg:block z-0 pointer-events-none transform transition-all duration-1000 ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <BenzeneRing 
            size={ring.size}
            color={ring.color}
            animated={true}
            rotationSpeed={ring.rotationSpeed}
          />
        </div>
      ))}
      
      {bubbles.map((bubble, index) => (
        <div 
          key={index}
          className={`chemical-bubble ${bubble.size} ${bubble.position} ${bubble.delay} ${bubble.opacity} hidden lg:block pointer-events-none transform transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: `${index * 150}ms` }}
        ></div>
      ))}

      <div className="molecule-line h-1 w-40 top-1/4 right-1/4 hidden lg:block pointer-events-none"></div>
      <div className="molecule-line h-1 w-32 bottom-1/3 left-1/4 rotate-90 hidden lg:block pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header section */}
        <header className="text-center mb-16 mt-8 transform transition-all duration-1000 opacity-0 translate-y-4" style={{ animation: 'fadeInUp 0.8s forwards 0.3s' }}>
          <div className="flex justify-center mb-6 relative">
            <div className="relative">
              <Beaker className="h-16 w-16 text-chemical-green animate-float" />
              <div className="absolute -top-5 -right-8 animate-spin-slow">
                <BenzeneRing size={40} color="rgba(16, 185, 129, 0.7)" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-exo">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">AI-Driven</span>{" "}
            <span>Chemical Risk Prediction</span>
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Advanced chemical risk prediction and analysis platform powered by artificial intelligence
            and machine learning algorithms for accurate threat identification.
          </p>
          
          <div className="flex justify-center mt-8 space-x-4">
            <div className="animate-spin-slow">
              <BenzeneRing size={30} color="rgba(139, 92, 246, 0.6)" />
            </div>
            <div className="animate-spin-slow animation-delay-500">
              <BenzeneRing size={30} color="rgba(14, 165, 233, 0.6)" />
            </div>
            <div className="animate-spin-slow animation-delay-1000">
              <BenzeneRing size={30} color="rgba(16, 185, 129, 0.6)" />
            </div>
          </div>
        </header>

        {/* Cards section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {riskCards.map((card, index) => (
            <div 
              key={index} 
              className={`relative transform transition-all duration-500 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              } hover:translate-y-[-8px]`}
              style={{ transitionDelay: `${400 + index * 150}ms` }}
              onMouseEnter={() => handleCardHover(index)}
              onMouseLeave={handleCardLeave}
            >
              <div className={`absolute -top-3 -right-3 z-10 transition-all duration-300 ${
                hoveredCard === index ? "scale-125" : ""
              }`}>
                <BenzeneRing size={30} color={`rgba(${index * 60}, 92, 246, 0.6)`} animated={hoveredCard === index} />
              </div>
              
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${card.color} opacity-0 transition-opacity duration-300 ${
                hoveredCard === index ? "opacity-10" : ""
              }`}></div>
              
              <RiskCard 
                {...card} 
                className={`transition-all duration-300 ${
                  hoveredCard === index ? "shadow-lg shadow-current/10" : "shadow-md"
                }`}
              />
            </div>
          ))}
        </div>
        
        {/* Additional decorative molecular elements */}
        <div className="mt-20 flex justify-center">
          <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
        </div>
      </div>
      
      {/* Add stylistic SVG molecular structures at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-32 overflow-hidden opacity-20 pointer-events-none">
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path d="M0,0 Q250,100 500,0 T1000,0 L1000,100 L0,100 Z" fill="currentColor" className="text-blue-500/20"></path>
        </svg>
      </div>
      
      {/* Inject custom animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        
        .chemical-bubble {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, 
            rgba(255, 255, 255, 0.4), 
            rgba(125, 211, 252, 0.2));
          animation: float 8s ease-in-out infinite;
        }
        
        .molecule-line {
          position: absolute;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(125, 211, 252, 0.3), 
            transparent);
          animation: pulse 6s ease-in-out infinite;
        }
        
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-5px) translateX(3px); }
          50% { transform: translateY(5px) translateX(-3px); }
          75% { transform: translateY(-10px) translateX(5px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default Index;
