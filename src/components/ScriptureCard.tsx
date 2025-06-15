
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Play, BookOpen } from 'lucide-react';

interface ScriptureCardProps {
  category: {
    name: string;
    description: string;
    color: string;
    questions?: string;
    difficulty?: string;
  };
  isNavigatable?: boolean;
}

const ScriptureCard: React.FC<ScriptureCardProps> = ({ category, isNavigatable = true }) => {
  // Landing page design (non-navigatable) with enhanced animations and styling
  const landingPageCard = (
    <Card className="h-full border-0 bg-gradient-to-br from-white via-orange-50/30 to-amber-50/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-700 overflow-hidden group hover:scale-105 relative">
      {/* Animated background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-orange-100/20 to-red-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-400/20 via-red-400/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
      
      <CardContent className="p-8 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {/* Enhanced title with gradient background and animation - no translate effects */}
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:via-red-600 group-hover:to-amber-600 group-hover:bg-clip-text transition-all duration-500 transform group-hover:scale-110">
                {category.name}
              </h3>
              {/* Animated underline */}
              <div className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r ${category.color} w-0 group-hover:w-full transition-all duration-500 delay-200`}></div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 leading-relaxed text-sm mb-6 group-hover:text-gray-700 transition-colors duration-300">
          {category.description}
        </p>
        
        {/* Enhanced decorative elements with animations */}
        <div className="flex items-center justify-between">
          <div className={`w-16 h-1 bg-gradient-to-r ${category.color} rounded-full group-hover:w-24 transition-all duration-500 transform group-hover:scale-y-150`}></div>
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider group-hover:text-orange-600 transition-colors duration-300 transform group-hover:scale-110">
            Sacred Text
          </div>
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-orange-400/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
        <div className="absolute top-8 right-8 w-1 h-1 bg-red-400/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500 delay-100"></div>
        <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-amber-400/50 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-400 delay-200"></div>
      </CardContent>
    </Card>
  );

  // Dashboard design (navigatable)
  const dashboardCard = (
    <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-white overflow-hidden min-h-[200px]">
      {/* Header with gradient bar */}
      <div className="relative p-6 pb-4">
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${category.color}`} />
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
            {category.name}
          </h3>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {category.description}
        </p>
      </div>
      
      <CardContent className="px-6 pb-6 pt-0">
        <div className="flex items-center justify-end text-sm">
          <div className="flex items-center text-orange-600 font-medium group-hover:text-orange-700">
            <Play className="w-4 h-4 mr-1" />
            <span>Start Quiz</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const cardContent = isNavigatable ? dashboardCard : landingPageCard;

  if (isNavigatable) {
    return (
      <Link to={`/quiz/category/${encodeURIComponent(category.name)}`} className="group block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default ScriptureCard;
