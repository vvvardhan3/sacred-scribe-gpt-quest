
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    'Learning': [
      { name: 'Bhagavad Gita', href: '/quiz/category/bhagavad-gita' },
      { name: 'Upanishads', href: '/quiz/category/upanishads' },
      { name: 'Ramayana', href: '/quiz/category/ramayana' },
      { name: 'Mahabharata', href: '/quiz/category/mahabharata' }
    ],
    'Features': [
      { name: 'AI Assistant', href: '/chat' },
      { name: 'Interactive Quizzes', href: '/dashboard' },
      { name: 'Progress Tracking', href: '/dashboard' },
      { name: 'Study Groups', href: '#' }
    ],
    'Support': [
      { name: 'Help Center', href: '#' },
      { name: 'Contact Us', href: '#contact' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' }
    ],
    'Company': [
      { name: 'About Us', href: '#' },
      { name: 'Our Mission', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">हिं</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                HinduGPT
              </span>
            </div>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              Deepen your understanding of Hindu philosophy and scriptures through AI-powered learning, 
              interactive quizzes, and personalized guidance on your spiritual journey.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-8 h-8 bg-gray-700 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 rounded-full flex items-center justify-center transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-orange-400 mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Email us at</p>
                <p className="text-white text-sm">support@hindugpt.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Call us at</p>
                <p className="text-white text-sm">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 HinduGPT. All rights reserved. Built with devotion for spiritual learning.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link to="#" className="text-gray-400 hover:text-orange-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-gray-400 hover:text-orange-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="text-gray-400 hover:text-orange-400 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
