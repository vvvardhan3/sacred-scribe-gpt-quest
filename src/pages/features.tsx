import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  BookOpen,
  Brain,
  MessageCircle,
  Target,
  Users,
} from "lucide-react";
import React from "react";

// eslint-disable-next-line react-refresh/only-export-components
export default function () {
  return (
    <>
      <section className=" bg-gradient-to-br from-white to-orange-50">
        <div className="max-w-7xl py-20 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Explore the <span className="text-orange-600">Features</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              HinduGPT combines ancient wisdom with modern technology to create
              an immersive learning experience focused on Hindu philosophy and
              traditions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
              <CardHeader className="text-start">
                <Brain className="w-10 h-10 text-orange-400 mb-2" />
                <CardTitle className="text-xl font-bold ">
                  AI-Powered Assistant
                </CardTitle>
                <CardDescription>
                  Engage with our intelligent AI that specializes in Hindu
                  philosophy, scriptures, and practices.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              aria-disabled="true"
              className="border-0
             bg-white text-muted-foreground      
             opacity-90 pointer-events-none       
             shadow-lg transition-none"
            >
              <CardHeader className="text-start">
                <BookOpen className="w-10 h-10 text-orange-400 mb-2" />
                <CardTitle className="text-xl font-bold">
                  Sacred Text Library{" "}
                  <span className="text-sm ">(Coming soon)</span>
                </CardTitle>
                <CardDescription>
                  Access and search through thousands of ancient Hindu texts and
                  scriptures with helpful explanations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
              <CardHeader className="text-start">
                <Target className="w-10 h-10 mb-2 text-orange-400" />
                <CardTitle className="text-xl font-bold">
                  Interactive Quizzes
                </CardTitle>
                <CardDescription>
                  Test your knowledge and learn through engaging quizzes
                  covering various aspects of Hindu wisdom.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              aria-disabled="true"
              className="border-0
             bg-white text-muted-foreground      
             opacity-90 pointer-events-none       
             shadow-lg transition-none"
            >
              <CardHeader className="text-start">
                <MessageCircle className="w-10 h-10 mb-2 text-orange-400" />
                <CardTitle className="text-xl font-bold">
                  Knowledge Exploration{" "}
                  <span className="text-sm ">(Coming soon)</span>
                </CardTitle>
                <CardDescription>
                  Ask questions and receive detailed explanations about Hindu
                  concepts, deities, and traditions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              aria-disabled="true"
              className="border-0
             bg-white text-muted-foreground      
             opacity-90 pointer-events-none       
             shadow-lg transition-none"
            >
              <CardHeader className="text-start">
                <BarChart3 className="w-10 h-10 mb-2 text-orange-400" />
                <CardTitle className="text-xl font-bold">
                  Progress Tracking{" "}
                  <span className="text-sm ">(Coming soon)</span>
                </CardTitle>
                <CardDescription>
                  Monitor your learning journey with personalized progress
                  tracking and achievements.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              aria-disabled="true"
              className="border-0
             bg-white text-muted-foreground      
             opacity-90 pointer-events-none       
             shadow-lg transition-none"
            >
              <CardHeader className="text-start">
                <Users className="w-10 h-10 text-orange-400 mb-2" />
                <CardTitle className="text-xl font-bold">
                  Personalized Learning{" "}
                  <span className="text-sm ">(Coming soon)</span>
                </CardTitle>
                <CardDescription>
                  Get customized learning paths based on your interests and
                  previous interactions.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
