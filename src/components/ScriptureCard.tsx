
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Play } from 'lucide-react';

interface ScriptureCardProps {
  category: {
    name: string;
    description: string;
    color: string;
    questions?: string;
    difficulty?: string;
  };
}

const ScriptureCard: React.FC<ScriptureCardProps> = ({ category }) => {
  return (
    <Link to={`/quiz/category/${encodeURIComponent(category.name)}`} className="group block">
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
    </Link>
  );
};

export default ScriptureCard;
