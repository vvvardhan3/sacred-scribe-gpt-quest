
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
  // Landing page design (non-navigatable)
  const landingPageCard = (
    <Card className="h-full border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:-translate-y-2 hover:scale-105">
      <CardContent className="p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
              {category.name}
            </h3>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center ml-4">
            <BookOpen className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        
        <p className="text-gray-600 leading-relaxed text-sm mb-6">
          {category.description}
        </p>
        
        {/* Decorative element */}
        <div className="flex items-center justify-between">
          <div className={`w-16 h-1 bg-gradient-to-r ${category.color} rounded-full`}></div>
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            Sacred Text
          </div>
        </div>
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
