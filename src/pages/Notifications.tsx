
import React from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';

const Notifications = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <Navigation />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-orange-600 hover:bg-orange-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Notification Preferences</h1>
            <p className="text-lg text-gray-600">Customize how you want to receive updates about your spiritual learning journey</p>
          </div>

          <Card className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 border-0 text-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Construction className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Working on This Feature</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-white/90 text-lg">
                We're currently developing notification preferences to help you stay connected to your spiritual journey. 
                This feature will be available soon!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
