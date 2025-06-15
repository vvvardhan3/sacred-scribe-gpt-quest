
import React from 'react';

const ContactSection = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Contact Us?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Have questions about Hindu scriptures or need help with our platform? 
          We're here to guide you on your spiritual journey.
        </p>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white max-w-2xl mx-auto">
        <h4 className="text-xl font-semibold mb-6 text-center">How We Can Help You</h4>
        <ul className="space-y-4">
          <li className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
            <span>Get personalized scripture recommendations</span>
          </li>
          <li className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
            <span>Join study groups and discussions</span>
          </li>
          <li className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
            <span>Report bugs or suggest features</span>
          </li>
          <li className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
            <span>Schedule one-on-one mentoring sessions</span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default ContactSection;
