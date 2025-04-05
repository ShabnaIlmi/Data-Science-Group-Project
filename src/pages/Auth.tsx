import { Link } from "react-router-dom";
import { FlaskConical, Shield, Lock, Mail } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

const Auth = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-0 w-full h-96 bg-teal-500 opacity-5 rounded-full blur-3xl transform -translate-y-1/2 -translate-x-1/4 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-full h-96 bg-blue-500 opacity-5 rounded-full blur-3xl transform translate-y-1/2 translate-x-1/4 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-teal-400 opacity-10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-400 opacity-10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        
        {/* Molecular Pattern - Hexagons */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <pattern id="molecularPattern" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(30)">
            <path d="M10,0 L20,5.77 L20,17.32 L10,23.09 L0,17.32 L0,5.77 L10,0" stroke="currentColor" fill="none"/>
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#molecularPattern)" />
        </svg>
        
        {/* Additional molecular structures */}
        <svg className="absolute top-20 right-20 w-40 h-40 text-teal-800 opacity-[0.05]" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="5" fill="currentColor" />
          <circle cx="80" cy="30" r="5" fill="currentColor" />
          <circle cx="30" cy="80" r="5" fill="currentColor" />
          <circle cx="20" cy="30" r="5" fill="currentColor" />
          <circle cx="70" cy="70" r="5" fill="currentColor" />
          <line x1="50" y1="50" x2="80" y2="30" stroke="currentColor" strokeWidth="2" />
          <line x1="50" y1="50" x2="30" y2="80" stroke="currentColor" strokeWidth="2" />
          <line x1="50" y1="50" x2="20" y2="30" stroke="currentColor" strokeWidth="2" />
          <line x1="50" y1="50" x2="70" y2="70" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="container relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px] md:w-[480px] p-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white">
          {/* Logo and Heading */}
          <div className="flex flex-col space-y-4 text-center">
            <div className="flex justify-center">
              <Link to="/" className="group flex items-center gap-2 transition-all duration-300 hover:scale-105">
                <div className="p-2 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300">
                  <FlaskConical className="w-10 h-10 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">ChemRisk AI</span>
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-sm text-gray-500 px-6 max-w-sm mx-auto">
              Sign in to access advanced chemical risk assessment tools and real-time analytics
            </p>
          </div>
          
          {/* Security Badge */}
          <div className="flex items-center justify-center text-xs text-gray-500">
            <Shield className="h-4 w-4 mr-1 text-teal-500" />
            <span>Enterprise-grade security</span>
          </div>
          
          {/* Login Form Section */}
          <div className="w-full space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200"></span>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-6 py-1 rounded-full text-gray-600 font-medium">Sign In</span>
              </div>
            </div>
            
            <LoginForm />
            
            <div className="flex justify-center">
              <Link to="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1 transition-colors">
                <Lock className="h-3 w-3" />
                <span>Forgot your password?</span>
              </Link>
            </div>
          </div>
          
          {/* Contact Support */}
          <div className="flex justify-center pt-2">
            <Link to="/support" className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
              <Mail className="h-3 w-3" />
              <span>Need help? Contact Support</span>
            </Link>
          </div>
          
          {/* Terms and Policies */}
          <div className="text-center text-xs text-gray-400 pt-2">
            By signing in, you agree to our 
            <Link to="/terms" className="text-teal-600 hover:text-teal-700 hover:underline mx-1 transition-colors">Terms of Service</Link>
            and
            <Link to="/privacy" className="text-teal-600 hover:text-teal-700 hover:underline mx-1 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
