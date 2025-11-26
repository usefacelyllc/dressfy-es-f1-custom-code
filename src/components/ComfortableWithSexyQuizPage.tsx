import React, { useState } from 'react';
import ProgressBar from './ProgressBar';

interface ComfortableWithSexyQuizPageProps {
  onBack: () => void;
  onContinue: () => void;
}

const ComfortableWithSexyQuizPage: React.FC<ComfortableWithSexyQuizPageProps> = ({ onBack, onContinue }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const options = ['Sí', 'No', 'No estoy seguro/a'];

  const handleSelection = (option: string) => {
    setSelectedOption(option);
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
          <div className="w-8"></div> {/* Spacer */}
        </header>

        <ProgressBar currentStep={2} totalSteps={2} activeSection={3} />

        {/* Main Content */}
        <div className="text-left">
          <h1 className="text-3xl font-playfair font-bold mb-4 leading-tight">
            ¿Te sientes cómoda/o cuando los hombres encuentran tu apariencia sexy?
          </h1>
          <p className="text-lg text-gray-600 font-sen mb-8">
            ¿Estás de acuerdo con la afirmación anterior?
          </p>

          {/* Options */}
          <div className="space-y-4">
            {options.map((option) => {
              const isSelected = selectedOption === option;
              return (
                <button
                  key={option}
                  className={`w-full text-left p-4 border rounded-xl text-lg font-sen transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-principal ${
                    isSelected
                      ? 'bg-principal text-complementar border-principal scale-105 shadow-md'
                      : 'bg-complementar border-secundaria text-apoio hover:border-principal'
                  }`}
                  onClick={() => handleSelection(option)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComfortableWithSexyQuizPage;