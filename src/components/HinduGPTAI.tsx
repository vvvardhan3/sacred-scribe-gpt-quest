
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HinduGPTAI = () => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate('/chat');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Powered by Advanced AI
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ask HinduGPT Anything About Hindu Philosophy
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get instant, accurate answers from the Vedas, Upanishads, Bhagavad Gita, Puranas, and other sacred texts. 
            Our AI assistant has deep knowledge of Hindu scriptures and philosophy.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-orange-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <MessageCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ask Questions</h3>
              <p className="text-gray-600 text-sm">
                Ask about dharma, karma, moksha, or any philosophical concept
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm border border-orange-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Citations</h3>
              <p className="text-gray-600 text-sm">
                Every answer includes references to original scripture sources
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm border border-orange-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <MessageCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Learn Deeply</h3>
              <p className="text-gray-600 text-sm">
                Explore complex philosophical concepts with detailed explanations
              </p>
            </div>
          </div>

          <Button 
            onClick={handleChatClick}
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Start Chatting with HinduGPT
          </Button>

          <div className="mt-6 text-sm text-gray-500">
            Free to try • Upgrade for unlimited conversations
          </div>
        </div>
      </div>
    </section>
  );
};
