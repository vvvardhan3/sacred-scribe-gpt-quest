import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, MessageCircle, ArrowRight, Zap, Star, Menu, X } from 'lucide-react';
import { PricingSection } from '@/components/PricingSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ScriptureCard from '@/components/ScriptureCard';
import HinduGPTAI from '@/components/HinduGPTAI';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoClick = () => {
    window.location.reload();
  };

  // Define scripture categories with orange-themed gradients
  const scriptureCategories = [
    {
      name: 'Vedas',
      description: 'Ancient sacred texts - Rigveda, Samaveda, Yajurveda, and Atharvaveda',
      color: 'from-orange-400 to-amber-500'
    },
    {
      name: 'Puranas',
      description: 'Stories and legends of gods, goddesses, and ancient heroes',
      color: 'from-red-400 to-orange-500'
    },
    {
      name: 'Upanishads',
      description: 'Philosophical texts exploring the nature of reality and consciousness',
      color: 'from-amber-400 to-orange-600'
    },
    {
      name: 'Bhagavad Gita',
      description: 'Divine discourse between Krishna and Arjuna on dharma and yoga',
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'Mahabharata',
      description: 'Epic tale of the Kurukshetra war and dharmic principles',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      name: 'Ramayana',
      description: 'Epic journey of Rama, Sita, and the triumph of good over evil',
      color: 'from-orange-600 to-red-600'
    }
  ];

  return (
    <div className=" bg-gradient-to-br from-orange-50 to-red-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={handleLogoClick}>
              {/* <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">हिं</span>
              </div> */}
              <img src="/icon.png" alt="HinduGPT Logo" className="w-16 h-16 rounded-full" />
              {/* <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">HinduGPT</h1> */}
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-4">
              <Link to="/login">
                <Button variant="outline" className="border-orange-200 hover:border-orange-300 hover:bg-orange-50">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">Get Started</Button>
              </Link>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-600 hover:text-orange-600">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 bg-white">
                  <div className="flex flex-col space-y-4 mt-8">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-orange-200 hover:border-orange-300 hover:bg-orange-50">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className=" py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 to-red-100/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-200">
              <span className="text-sm font-medium text-orange-700">AI-Powered Hindu Scripture Learning</span>
            </div>
          </div>
          
          <h2 className="text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Explore Hindu Scriptures 
            <span className="text-6xl block bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              with AI Guidance
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Discover the profound wisdom of ancient Hindu texts through interactive quizzes and AI-powered conversations. 
            Learn from the Bhagavad Gita, Upanishads, Ramayana, and more with personalized spiritual guidance.
          </p>
          
          <div className="flex justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Scripture Categories Section */}
      <section className="py-20 bg-gradient-to-br from-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
              Explore Sacred Scriptures
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Test your knowledge with AI-generated quizzes across different Hindu texts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scriptureCategories.map((category, index) => (
              <ScriptureCard key={index} category={category} isNavigatable={false} />
            ))}
          </div>
        </div>
      </section>

      {/* HinduGPT AI Section - Replacing the Features Section */}
      <HinduGPTAI />

      {/* Pricing Section */}
      <PricingSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;