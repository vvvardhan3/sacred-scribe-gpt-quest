
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Bell, Mail, MessageSquare, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Notifications = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    chatNotifications: true,
    paymentNotifications: true,
    weeklyDigest: false,
    marketingEmails: false,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: "Preferences Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const notificationSettings = [
    {
      id: 'emailNotifications',
      icon: <Mail className="w-5 h-5" />,
      title: 'Email Notifications',
      description: 'Receive important updates via email',
      enabled: preferences.emailNotifications,
    },
    {
      id: 'pushNotifications',
      icon: <Bell className="w-5 h-5" />,
      title: 'Push Notifications',
      description: 'Get browser notifications for real-time updates',
      enabled: preferences.pushNotifications,
    },
    {
      id: 'chatNotifications',
      icon: <MessageSquare className="w-5 h-5" />,
      title: 'Chat Notifications',
      description: 'Notifications for new chat messages and responses',
      enabled: preferences.chatNotifications,
    },
    {
      id: 'paymentNotifications',
      icon: <CreditCard className="w-5 h-5" />,
      title: 'Payment & Billing',
      description: 'Updates about payments, subscriptions, and billing',
      enabled: preferences.paymentNotifications,
    },
  ];

  const emailSettings = [
    {
      id: 'weeklyDigest',
      title: 'Weekly Learning Digest',
      description: 'Summary of your spiritual learning progress and insights',
      enabled: preferences.weeklyDigest,
    },
    {
      id: 'marketingEmails',
      title: 'Feature Updates & Tips',
      description: 'Learn about new features and spiritual learning tips',
      enabled: preferences.marketingEmails,
    },
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
            {/* Main Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-600" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {notificationSettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-orange-600">
                        {setting.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{setting.title}</h3>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={setting.enabled}
                      onCheckedChange={() => handleToggle(setting.id as keyof typeof preferences)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Email Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-orange-600" />
                  Email Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {emailSettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{setting.title}</h3>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                    <Switch
                      checked={setting.enabled}
                      onCheckedChange={() => handleToggle(setting.id as keyof typeof preferences)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-center">
              <Button 
                onClick={() => toast({
                  title: "Settings Saved",
                  description: "All your notification preferences have been saved successfully.",
                })}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-2"
              >
                Save All Preferences
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
