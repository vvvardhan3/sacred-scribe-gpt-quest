
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">हिं</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              HinduGPT
            </span>
          </div>
          
          {/* <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-orange-600 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-700 hover:text-orange-600 transition-colors">Pricing</a>
            <a href="#about" className="text-gray-700 hover:text-orange-600 transition-colors">About</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-700 hover:text-orange-600">
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
              Get Started
            </Button>
          </div> */}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
