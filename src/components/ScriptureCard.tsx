
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Play, Clock, Star } from 'lucide-react';

interface ScriptureCardProps {
  category: {
    name: string;
    description: string;
    image: string;
    color: string;
    questions: string;
    difficulty: string;
  };
}

const ScriptureCard: React.FC<ScriptureCardProps> = ({ category }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Link to={`/quiz/category/${encodeURIComponent(category.name)}`} className="group block">
      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-white overflow-hidden">
        {/* Image Header */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={category.image} 
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${category.color}`} />
          <div className="absolute top-4 right-4">
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(category.difficulty)}`}>
              {category.difficulty}
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
            {category.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {category.description}
          </p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{category.questions}</span>
            </div>
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
