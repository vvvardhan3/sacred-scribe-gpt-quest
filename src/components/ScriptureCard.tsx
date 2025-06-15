
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { ArrowRight, Play } from 'lucide-react';

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
  return (
    <Link
      to={`/quiz/category/${encodeURIComponent(category.name)}`}
      className="group block"
    >
      <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm overflow-hidden relative">
        <div className={`h-2 bg-gradient-to-r ${category.color}`} />
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-300"
          style={{
            backgroundImage: `url(${category.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Content with gradient overlay */}
        <div className="relative z-10 bg-gradient-to-t from-white/95 via-white/90 to-white/95 h-full">
          <div className="p-6 h-full flex flex-col">
            <div className="mb-4 flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                  {category.name}
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed mb-4">
                  {category.description}
                </CardDescription>
              </div>
              <div className="inline-flex items-center px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full border border-orange-100">
                <span className="text-xs font-medium text-gray-700">{category.difficulty}</span>
              </div>
            </div>
            
            <div className="mt-auto flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">{category.questions}</span>
              <div className="flex items-center text-orange-600">
                <Play className="w-4 h-4 mr-1" />
                <span className="font-medium">Start Quiz</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ScriptureCard;
