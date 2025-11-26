import React, { useState } from 'react';
import ProgressBar from './ProgressBar';

interface SensitiveSkinQuizPageProps {
  onBack: () => void;
  onContinue: () => void;
}

const SensitiveSkinQuizPage: React.FC<SensitiveSkinQuizPageProps> = ({ onBack, onContinue }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options = ['Sensible', 'No sensible'];

  const handleSelection = (option: string) => {
    setSelectedOption(option);
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
          <div className="w-8"></div> {/* Spacer */}
        </header>

        <ProgressBar currentStep={7} totalSteps={8} activeSection={1} />

        {/* Main Content */}
        <div className="text-left">
          <h1 className="text-4xl font-playfair font-bold mb-8">
            ¿Sientes que tu piel es sensible?
          </h1>

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

          {/* Helper Text */}
          <div className="mt-6 text-sm text-gray-600 relative min-h-[6rem]">
              <div className={`absolute top-0 left-0 transition-opacity duration-300 ease-in-out ${selectedOption === 'Sensible' ? 'opacity-100' : 'opacity-0'}`}>
                  <p>
                      Enrojecimiento, sequedad y sensaciones de ardor.
                  </p>
              </div>
              <div className={`absolute top-0 left-0 transition-opacity duration-300 ease-in-out ${selectedOption === 'No sensible' ? 'opacity-100' : 'opacity-0'}`}>
                  <p>
                      Sin reacción a ciertos ingredientes y productos para el cuidado de la piel.
                  </p>
              </div>
          </div>
        </div>
      </div>
      
      {/* Floating Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-complementar p-4 border-t border-secundaria">
        <div className="max-w-sm mx-auto">
            <button 
              onClick={onContinue}
              disabled={!selectedOption}
              className="w-full bg-apoio text-complementar py-4 px-6 rounded-xl text-lg font-sen font-bold shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-apoio disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed enabled:hover:bg-opacity-90 enabled:hover:scale-105">
              CONTINUAR
            </button>
        </div>
      </div>
    </div>
  );
};

export default SensitiveSkinQuizPage;