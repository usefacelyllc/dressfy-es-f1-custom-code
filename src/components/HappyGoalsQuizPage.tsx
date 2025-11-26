import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import { useQuiz } from '../context/QuizContext';

interface HappyGoalsQuizPageProps {
  onBack: () => void;
  onContinue: () => void;
}

const CheckedIcon = () => (
  <div className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center bg-black flex-shrink-0">
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

const UncheckedIcon = () => (
  <div className="w-6 h-6 rounded border border-gray-200 bg-white flex-shrink-0" />
);

const HappyGoalsQuizPage: React.FC<HappyGoalsQuizPageProps> = ({ onBack, onContinue }) => {
  const { quizData, updateQuizData } = useQuiz();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(quizData.happyGoals || []);

  const options = [
    'Hacer lo que me gusta con más confianza',
    'Asistir a un evento especial',
    'Pasar más tiempo con las personas cercanas',
    'Sorprender a mi ser querido',
    'Compartir selfies',
    'Disfrutar de cómo las personas me miran',
    'Otro'
  ];

  const handleSelection = (goal: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goal)) {
        return prev.filter(item => item !== goal);
      } else {
        return [...prev, goal];
      }
    });
  };

  const handleContinue = () => {
      updateQuizData({ happyGoals: selectedGoals });
      onContinue();
  };

  return (
    <div className="bg-complementar text-apoio min-h-screen font-sen">
      <div className="max-w-sm mx-auto py-6 px-4 w-full pb-32">
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
          <div className="w-8"></div>
        </header>

        <ProgressBar currentStep={1} totalSteps={1} activeSection={5} totalSections={5} />

        {/* Main Content */}
        <div className="text-left">
          <h1 className="text-3xl font-playfair font-bold mb-2 leading-tight">
            Cuando estoy feliz con cómo me veo, me gustaría...
          </h1>
          <p className="text-lg text-gray-600 font-sen mb-8">
            Selecciona todo lo que corresponda
          </p>

          <div className="space-y-4">
            {options.map((option) => {
              const isSelected = selectedGoals.includes(option);
              return (
                <div
                  key={option}
                  className={`w-full flex items-center justify-between p-4 border rounded-xl text-lg font-sen transition-all duration-300 cursor-pointer bg-white ${
                    isSelected
                      ? 'border-gray-400 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSelection(option)}
                >
                  <span className="font-bold text-gray-800 pr-4 flex-1 text-left leading-tight">{option}</span>
                  <div className="flex-shrink-0">
                    {isSelected ? <CheckedIcon /> : <UncheckedIcon />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Footer Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-complementar p-4 border-t border-secundaria">
        <div className="max-w-sm mx-auto">
            <button 
              onClick={handleContinue}
              disabled={selectedGoals.length === 0}
              className="w-full bg-apoio text-complementar py-4 px-6 rounded-xl text-lg font-sen font-bold shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-apoio disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed enabled:hover:bg-opacity-90 enabled:hover:scale-105 uppercase"
            >
              CONTINUAR
            </button>
        </div>
      </div>
    </div>
  );
};

export default HappyGoalsQuizPage;