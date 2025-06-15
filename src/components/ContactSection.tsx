
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle, Phone, MapPin } from 'lucide-react';

const ContactSection = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help from our support team',
      contact: 'support@hindugpt.com',
      action: 'Send Email'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with us in real-time',
      contact: 'Available 24/7',
      action: 'Start Chat'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our team',
      contact: '+1 (555) 123-4567',
      action: 'Call Now'
    },
    {
      icon: MapPin,
      title: 'Office Location',
      description: 'Visit our spiritual center',
      contact: 'New Delhi, India',
      action: 'Get Directions'
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Have questions about Hindu scriptures or need help with our platform? 
          We're here to guide you on your spiritual journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {contactMethods.map((method, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <method.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{method.description}</p>
              <p className="text-orange-600 font-medium mb-4">{method.contact}</p>
              <Button variant="outline" size="sm" className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300">
                {method.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Send us a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              ></textarea>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                Send Message
              </Button>
            </form>
          </div>
          
          <div className="flex flex-col justify-center">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
              <h4 className="text-lg font-semibold mb-4">Why Contact Us?</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Get personalized scripture recommendations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Join study groups and discussions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Report bugs or suggest features</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Schedule one-on-one mentoring sessions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
