
import { Link } from "react-router-dom";
import { FlaskConical, Home, Users, Mail } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-teal-500" />
            <span className="font-semibold text-gray-800">ChemRisk AI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-teal-500 transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-teal-500 transition-colors flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>About Us</span>
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-teal-500 transition-colors flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </Link>
            <div className="w-px h-4 bg-gray-200 mx-2"></div>
            <Link to="/importer-risk" className="text-gray-600 hover:text-teal-500 transition-colors">
              Importer Risk
            </Link>
            <Link to="/end-user-risk" className="text-gray-600 hover:text-teal-500 transition-colors">
              End-User Risk
            </Link>
            <Link to="/recipe-risk" className="text-gray-600 hover:text-teal-500 transition-colors">
              Recipe Risk
            </Link>
            <Link to="/future-risk" className="text-gray-600 hover:text-teal-500 transition-colors">
              Future Risk
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
