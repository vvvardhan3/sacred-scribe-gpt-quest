
/* AnimatedQuiz.jsx */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const quizData = [
  {
    question: "Which text is considered the oldest of the Vedas?",
    options: ["Rigveda", "Samaveda", "Yajurveda", "Atharvaveda"],
  },
  {
    question: "Who delivers the Bhagavad Gita's discourse?",
    options: ["Krishna", "Arjuna", "Vyasa", "Bhishma"],
  },
  // add more questions here
];

const AnimatedQuiz = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);

  const handleOptionClick = (opt) => setSelected(opt);
  const handleNext = () => {
    setSelected(null);
    setCurrent((prev) => (prev + 1) % quizData.length);
  };

  return (
    <section id="quizzes" className="py-12 bg-orange-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900">
          {quizData[current].question}
        </h2>
        <div className="space-y-4">
          {quizData[current].options.map((opt) => (
            <motion.div
              key={opt}
              whileHover={{ scale: 1.02 }}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selected === opt
                  ? "bg-orange-100 border-orange-300"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleOptionClick(opt)}
            >
              {opt}
            </motion.div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button onClick={handleNext} disabled={!selected}>
            {current === quizData.length - 1 ? "Restart Quiz" : "Next Question"}
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default AnimatedQuiz;


