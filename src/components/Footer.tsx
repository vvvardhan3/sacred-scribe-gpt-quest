import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
} from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Support: [
      { name: "Contact Us", href: "#contact" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
    Features: [
      { name: "AI Assistant", href: "/chat" },
      { name: "Interactive Quizzes", href: "/dashboard" },
    ],

    // 'Company': [
    //   { name: 'About Us', href: '#' },
    //   { name: 'Our Mission', href: '#' },
    //   { name: 'Careers', href: '#' },
    //   { name: 'Blog', href: '#' }
    // ]
    "Contact Us": [
      {
        name: "Email Us",
        useHref: true,
        href: "mailto:support@hindugpt.com",
        icon: Mail,
      },
      {
        name: "Twitter / X",
        useHref: true,
        href: "https://twitter.com/hindugpt",
        icon: Twitter,
      },
    ],
  };

  const socialLinks = [{ name: "Twitter", icon: Twitter, href: "#" }];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              {/* <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">हिं</span>
              </div> */}
              <img
                src="/icon.png"
                alt="HinduGPT Logo"
                className="w-16 h-16 rounded-full"
              />
              {/* <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                HinduGPT
              </span> */}
            </div>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              Deepen your understanding of Hindu philosophy and scriptures
              through AI-powered learning, interactive quizzes on your spiritual
              journey.
            </p>
            {/* <div className="flex space-x-4">
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
            </div> */}
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

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 HinduGPT. All rights reserved. Built with love and devotion.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;