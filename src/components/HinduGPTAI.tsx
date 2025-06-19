import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain,
  MessageCircle,
  BookOpen,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const HinduGPTAI = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-orange-200/20 px-4 py-2 rounded-full border border-orange-200 mb-6">
            <span className="text-orange-700 font-medium">Your Spiritual AI Guide</span>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Unlock Ancient Wisdom with <span className="text-orange-600">HinduGPT AI</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Engage in insightful conversations, get instant answers, and explore the vastness of Hindu philosophy with your personalized AI companion.
          </p>
        </div>

        {/* Main Content */}
        <div className="items-center">
          {/* CTA Card */}
          {/* <div className="lg:pl-8">
            <Card className="bg-gradient-to-t from-orange-500 to-red-500 border-0 text-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">Start Your Journey</h3>
                <p className="text-white/90 mb-8">
                  Ask questions, explore scriptures, and deepen your understanding of Hindu philosophy through AI-powered conversations.
                </p>
                
                <Link to="/chat">
                  <Button className="w-1/4 bg-white text-orange-600 hover:bg-white/90 font-semibold py-3 text-lg">
                    Chat with HinduGPT
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-white/80">
                  <div>✓ 24/7 Available</div>
                  <div>✓ Authentic Sources</div>
                  <div>✓ Multi-language</div>
                  <div>✓ Personalized</div>
                </div>
              </CardContent>
            </Card>
          </div> */}
          <div className="lg:pl-8">
            <Card className="relative overflow-hidden rounded-xl border-0 bg-gradient-to-r from-orange-400 to-rose-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* playful confetti dots */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.15)_0,transparent_40%),radial-gradient(circle_at_90%_20%,rgba(255,255,255,0.1)_0,transparent_50%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.08)_0,transparent_50%)]"
              />

              <CardContent className="relative z-10 px-10 py-14 text-center text-white">
                {/* icon bubble */}
                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm ring-1 ring-inset ring-white/40">
                  <MessageCircle className="h-9 w-9 drop-shadow-sm" />
                </div>

                {/* headline + copy */}
                <h3 className="mb-3 text-3xl font-extrabold tracking-tight drop-shadow-sm">
                  Start&nbsp;Your&nbsp;Journey
                </h3>
                <p className="mx-auto mb-10 max-w-md text-lg text-white/90 leading-relaxed">
                  Ask questions, explore scriptures, and deepen your
                  understanding of Hindu philosophy through AI-powered
                  conversations.
                </p>

                {/* compact pill CTA */}
                <Link to="/chat" className="inline-block group">
                  <Button
                    size="lg"
                    className="rounded-full bg-white/90 px-8 py-3 font-semibold text-orange-600 backdrop-blur-md transition
                     hover:bg-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Chat with HinduGPT
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </Link>

                {/* feature checklist */}
                <ul className="mt-12 flex flex-row gap-4 items-center justify-center text-sm text-white/85">
                  <li className="flex items-center justify-center gap-2">
                    <span className="text-green-300">✓</span>{" "}
                    24/7&nbsp;Available
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="text-green-300">✓</span>{" "}
                    Authentic&nbsp;Sources
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="text-green-300">✓</span> citations
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HinduGPTAI;
