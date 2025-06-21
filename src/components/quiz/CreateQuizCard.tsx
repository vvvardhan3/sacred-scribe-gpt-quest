
import React from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CreateQuizCardProps {
  categoryName: string;
  isGenerating: boolean;
  canCreateNewQuiz: boolean;
  onCreateQuiz: () => void;
}

export const CreateQuizCard: React.FC<CreateQuizCardProps> = ({
  categoryName,
  isGenerating,
  canCreateNewQuiz,
  onCreateQuiz
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          Create New Quiz
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 mb-2">Generate a new 10-question quiz on {categoryName}</p>
            <p className="text-sm text-gray-500">Estimated time: 5-10 minutes</p>
          </div>
          <Button 
            onClick={onCreateQuiz}
            disabled={isGenerating || !canCreateNewQuiz}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? 'Generating...' : 'Create Quiz'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
