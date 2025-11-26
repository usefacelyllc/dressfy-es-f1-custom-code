import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import { useQuiz } from '../context/QuizContext';

interface SkinToneQuizPageProps {
  onBack: () => void;
  onContinue: () => void;
}

const SkinToneQuizPage: React.FC<SkinToneQuizPageProps> = ({ onBack, onContinue }) => {
  const { quizData, updateQuizData } = useQuiz();
  const [selectedTone, setSelectedTone] = useState<string | null>(quizData.skinTone || null);

  const skinTones = [
    { name: 'Pálido', color: '#F2E2D9' },
    { name: 'Claro', color: '#EBCFB3' },
    { name: 'Medio', color: '#D1A36B' },
    { name: 'Marrón', color: '#A07049' },
    { name: 'Marrón profundo', color: '#6F482A' },
  ];

  const handleSelection = (tone: string) => {
    setSelectedTone(tone);
    updateQuizData({ skinTone: tone });
    setTimeout(() => {
        onContinue();
    }, 400); // Delay for user to see selection and then move on
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
          <div className="w-8"></div> {/* Spacer */}
        </header>

        <ProgressBar currentStep={5} totalSteps={8} activeSection={1} />

        {/* Main Content */}
        <div className="text-left">
          <h1 className="text-4xl font-playfair font-bold mb-8 leading-tight">
            Selecciona el color más cercano a tu tono de piel
          </h1>

          {/* Skin Tone Options */}
          <div className="space-y-4">
            {skinTones.map(({ name, color }) => {
              const isSelected = selectedTone === name;
              return (
                <button
                  key={name}
                  className={`w-full flex items-center text-left p-4 border rounded-xl text-lg font-sen transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-principal ${
                    isSelected
                      ? 'bg-principal text-complementar border-principal scale-105 shadow-md'
                      : 'bg-complementar border-secundaria text-apoio hover:border-principal'
                  }`}
                  onClick={() => handleSelection(name)}
                >
                  <span className="w-6 h-6 rounded-md mr-4 border border-gray-300" style={{ backgroundColor: color }}></span>
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinToneQuizPage;