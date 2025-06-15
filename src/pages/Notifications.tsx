
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Bell, BellRing, MessageCircle, BookOpen, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState({
    quiz_reminders: true,
    new_content: true,
    ai_responses: false,
    achievements: true,
    daily_wisdom: true,
    email_digest: false
  });

  const handleToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const notificationSettings = [
    {
      key: 'quiz_reminders',
      title: 'Quiz Reminders',
      description: 'Get reminded to continue your spiritual learning journey',
      icon: BookOpen,
      color: 'text-orange-600'
    },
    {
      key: 'new_content',
      title: 'New Scripture Content',
      description: 'Be notified when new quizzes and content are added',
      icon: BellRing,
      color: 'text-amber-600'
    },
    {
      key: 'ai_responses',
      title: 'AI Chat Responses',
      description: 'Get notifications for HinduGPT chat responses',
      icon: MessageCircle,
      color: 'text-red-600'
    },
    {
      key: 'achievements',
      title: 'Achievements & Progress',
      description: 'Celebrate your learning milestones and achievements',
      icon: Trophy,
      color: 'text-yellow-600'
    },
    {
      key: 'daily_wisdom',
      title: 'Daily Wisdom',
      description: 'Receive daily quotes and wisdom from Hindu scriptures',
      icon: Bell,
      color: 'text-purple-600'
    },
    {
      key: 'email_digest',
      title: 'Weekly Email Digest',
      description: 'Get a summary of your learning progress via email',
      icon: BellRing,
      color: 'text-blue-600'
    }
  ];

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

          <div className="space-y-6">
            {notificationSettings.map((setting) => {
              const IconComponent = setting.icon;
              return (
                <Card key={setting.key} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center`}>
                          <IconComponent className={`w-5 h-5 ${setting.color}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{setting.title}</h3>
                          <p className="text-gray-600">{setting.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications[setting.key as keyof typeof notifications]}
                        onCheckedChange={() => handleToggle(setting.key)}
                        className="data-[state=checked]:bg-orange-600"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-8 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 border-0 text-white">
            <CardHeader>
              <CardTitle className="text-center text-white">Stay Connected to Your Spiritual Journey</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-white/90 mb-4">
                These notifications help you maintain consistency in your spiritual learning and stay updated with new wisdom from Hindu scriptures.
              </p>
              <Button 
                className="bg-white text-orange-600 hover:bg-white/90 font-semibold"
                onClick={() => window.location.reload()}
              >
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
