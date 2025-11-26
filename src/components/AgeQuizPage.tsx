import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import { useQuiz } from '../context/QuizContext';

interface AgeQuizPageProps {
  onBack: () => void;
  onContinue: () => void;
}

const AgeQuizPage: React.FC<AgeQuizPageProps> = ({ onBack, onContinue }) => {
  const { quizData, updateQuizData } = useQuiz();
  const [selectedAge, setSelectedAge] = useState<string | null>(quizData.age || null);
  const ageRanges = ['18-34', '35-44', '45-54', '55+'];

  const handleAgeSelection = (range: string) => {
    setSelectedAge(range);
    updateQuizData({ age: range });
    setTimeout(() => {
        onContinue();
    }, 400); // Delay for user to see selection
  };

  return (
    <div className="bg-complementar text-apoio min-h-screen font-sen">
      <div className="max-w-sm mx-auto py-6 px-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="text-3xl p-2 -ml-2 hover:opacity-75 transition-opacity" aria-label="Voltar">
            &lt;
          </button>
          <img 
            src="/assets/logo-dressfy.webp" 
            alt="Dressfy Logo"
            className="h-6"
          />
          <div className="w-8"></div> {/* Spacer to balance the header */}
        </header>

        <ProgressBar currentStep={1} totalSteps={8} activeSection={1} />

        {/* Main Content */}
        <div className="text-left">
          <h1 className="text-4xl font-playfair font-bold mb-2">
            ¿Cuál es tu edad?
          </h1>
          <p className="text-lg text-gray-600 font-sen mb-8">
            Da el primer paso para lucir lo mejor posible.
          </p>

          {/* Age Options */}
          <div className="space-y-4">
            {ageRanges.map((range) => {
              const isSelected = selectedAge === range;
              return (
                <button
                  key={range}
                  className={`w-full text-left p-4 border rounded-xl text-lg font-sen transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-principal ${
                    isSelected
                      ? 'bg-principal text-complementar border-principal scale-105 shadow-md'
                      : 'bg-complementar border-secundaria text-apoio hover:border-principal'
                  }`}
                  onClick={() => handleAgeSelection(range)}
                >
                  {range}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeQuizPage;