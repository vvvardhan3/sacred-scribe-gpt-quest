import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Import your icons or images here
import {
  BookOpen,
  MessageCircle,
  Zap,
  Star,
  Brain,
  Target,
  Users,
  BarChart3,
} from "lucide-react";

const slides = [
  {
    title: "Vedas",
    description:
      "Ancient sacred texts - Rigveda, Samaveda, Yajurveda, and Atharvaveda. Dive into hymns, chants, and rituals that form the foundation of Hindu philosophy.",
    image: "https://www.hinduamerican.org/wp-content/uploads/2020/09/968px-Ganesha_write_Mahabharata-e1599849933890.jpg"
  },
  {
    title: "Puranas",
    description:
      "Stories and legends of gods, goddesses, and ancient heroes. Explore cosmic cycles, genealogies, and moral lessons through vibrant narratives.",
    icon: <Zap size={48} className="text-red-500" />,
  },
  {
    title: "Upanishads",
    description:
      "Philosophical texts exploring the nature of reality and consciousness. Engage with profound dialogues on Brahman, Atman, and the means to spiritual liberation.",
    icon: <Brain size={48} className="text-yellow-600" />,
  },
  {
    title: "Bhagavad Gita",
    description:
      "Divine discourse between Krishna and Arjuna on dharma and yoga. Learn practical wisdom on duty, devotion, and the paths to self-realization.",
    image: "/bhagavadgita.png"
  },
  {
    title: "Mahabharata",
    description:
      "Epic tale of the Kurukshetra war and dharmic principles. Witness grand battles, complex characters, and timeless lessons on righteousness.",
    image: "/mahabharatha.jpg"
  },
  {
    title: "Ramayana",
    description:
      "Epic journey of Rama, Sita, and the triumph of good over evil. Follow the hero’s quest, trials, and the power of unwavering devotion.",
    image:
      "/Ramayana.jpg",
  },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const nextSlide = () => setCurrent((prev) => (prev + 1) % length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + length) % length);

  return (
    <section className="max-w-7xl py-20 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-6">
        <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
          Featured Texts
        </span>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          Explore Hindu Scriptures
        </h2>
        <p className="mt-2 text-gray-600">
          Swipe through key texts and learn their core themes and teachings.
        </p>
      </div>
      <div className="flex justify-center space-x-4 overflow-hidden p-4">
        {Array.from({ length: 3 }).map((_, i) => {
          const index = (current + i) % length;
          const slide = slides[index];
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md flex flex-col items-center text-center hover:shadow-lg scale-100 hover:scale-105 transition-transform  w-[450px] h-[475px]"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-80 rounded-md object-cover"
              />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {slide.title}
              </h3>
              <p className="mt-2 text-gray-600 text-sm px-4">{slide.description}</p>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons below the slides */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={prevSlide}
          className="bg-white rounded-full p-2 shadow hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <button
          onClick={nextSlide}
          className="bg-white rounded-full p-2 shadow hover:bg-gray-100"
        >
          <ArrowRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </section>
  );
};

export default Carousel;
