import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  MessageCircle,
  ArrowRight,
  Zap,
  Star,
  Menu,
  X,
  Brain,
  Target,
  Users,
  BarChart3,
} from "lucide-react";
import { PricingSection } from "@/components/PricingSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScriptureCard from "@/components/ScriptureCard";
import HinduGPTAI from "@/components/HinduGPTAI";
// import { Link, Element } from "react-scroll";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Features from "./features";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  // Define scripture categories with orange-themed gradients
  const scriptureCategories = [
    {
      name: "Vedas",
      description:
        "Ancient sacred texts - Rigveda, Samaveda, Yajurveda, and Atharvaveda",
      color: "from-orange-400 to-amber-500",
    },
    {
      name: "Puranas",
      description: "Stories and legends of gods, goddesses, and ancient heroes",
      color: "from-red-400 to-orange-500",
    },
    {
      name: "Upanishads",
      description:
        "Philosophical texts exploring the nature of reality and consciousness",
      color: "from-amber-400 to-orange-600",
    },
    {
      name: "Bhagavad Gita",
      description:
        "Divine discourse between Krishna and Arjuna on dharma and yoga",
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Mahabharata",
      description: "Epic tale of the Kurukshetra war and dharmic principles",
      color: "from-yellow-500 to-orange-500",
    },
    {
      name: "Ramayana",
      description:
        "Epic journey of Rama, Sita, and the triumph of good over evil",
      color: "from-orange-600 to-red-600",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-100">
      {/* Header - Updated to match design */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={handleLogoClick}
            >
              <img
                src="/icon.png"
                alt="HinduGPT Logo"
                className="w-16 h-16 rounded-full"
              />

              {/* Fix this margin-right for this text */}
              {/* <span className="text-lg font-bold text-gray-900">HinduGPT</span> */}
            </div>

            {/* Desktop Navigation - Added menu items */}
            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex space-x-8">
                <a className="feature text-gray-600 hover:text-orange-600 font-medium transition-colors">
                  Features
                </a>
                <a className="text-gray-600 hover:text-orange-600 font-medium transition-colors">
                  Quizzes
                </a>
                <a className="text-gray-600 hover:text-orange-600 font-medium transition-colors">
                  AI Assistant
                </a>
                <a className="text-gray-600 hover:text-orange-600 font-medium transition-colors">
                  Pricing
                </a>
              </nav>
            </div>

            <div className="flex space-x-4">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-orange-200 hover:border-orange-300 hover:bg-orange-50"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:text-orange-600"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 bg-white">
                  <div className="flex flex-col space-y-4 mt-8">
                    <a
                      href="#features"
                      className="text-gray-600 hover:text-orange-600 font-medium transition-colors"
                    >
                      Features
                    </a>
                    <Link
                      to="/dashboard"
                      className="text-gray-600 hover:text-orange-600 font-medium transition-colors"
                    >
                      Quizzes
                    </Link>
                    <Link
                      to="/chat"
                      className="text-gray-600 hover:text-orange-600 font-medium transition-colors"
                    >
                      AI Assistant
                    </Link>
                    <a
                      href="#pricing"
                      className="text-gray-600 hover:text-orange-600 font-medium transition-colors"
                    >
                      Pricing
                    </a>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-orange-200 hover:border-orange-300 hover:bg-orange-50"
                      >
                        Log In
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Updated to match design */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/10 to-red-100/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-200">
              <span className="text-sm font-medium text-orange-700">
                Explore Hindu wisdom with AI
              </span>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Discover ancient wisdom
            <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              with HinduGPT
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            An interactive AI assistant that helps you learn about Hindu
            philosophy, scriptures, and traditions through engaging
            conversations and quizzes.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Try HinduGPT →
              </Button>
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto border-t-2 border-gray-200/60 pt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                10+
              </div>
              <div className="text-gray-600">Sacred Books</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                500+
              </div>
              <div className="text-gray-600">Knowledge Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600">AI Assistance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Updated to match design */}

     <Features/>

      {/* HinduGPT AI Section */}
      <HinduGPTAI />

      {/* Pricing Section */}
      <div id="pricing">
        <PricingSection />
      </div>

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
