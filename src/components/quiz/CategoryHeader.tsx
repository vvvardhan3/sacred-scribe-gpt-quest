
import React from 'react';
import { BookOpen } from 'lucide-react';

interface CategoryHeaderProps {
  name: string;
  description: string;
  color: string;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({ name, description, color }) => {
  return (
    <div className="text-center mb-8">
      <div className={`inline-block p-4 rounded-full bg-gradient-to-r ${color} mb-4`}>
        <BookOpen className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{name}</h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">{description}</p>
    </div>
  );
};
