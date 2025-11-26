import React, { useState } from 'react';
import ProgressBar from './ProgressBar';

interface SkinConcernsQuizPageProps {
  onBack: () => void;
  onContinue: () => void;
}

const CheckedIcon = () => (
  <div className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center bg-gray-100 flex-shrink-0">
    <svg className="w-4 h-4 text-apoio" fill="none" stroke="currentColor" viewBox="0 0 24 24">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

const UncheckedIcon = () => (
  <div className="w-6 h-6 rounded border border-gray-200 bg-white flex-shrink-0" />
);

const SkinConcernsQuizPage: React.FC<SkinConcernsQuizPageProps> = ({ onBack, onContinue }) => {
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const noneOfTheAbove = 'Ninguna de las anteriores';
  const concerns = [
    'Arrugas',
    'Sequedad',
    'Ojos hinchados',
    'Ojeras',
    'Pigmentación',
    'Piel flácida',
    'Exceso de grasa',
    noneOfTheAbove,
  ];

  const handleSelection = (concern: string) => {
    setSelectedConcerns(prev => {
      if (concern === noneOfTheAbove) {
        return prev.includes(noneOfTheAbove) ? [] : [noneOfTheAbove];
      }
      
      const newSelection = prev.includes(concern)
        ? prev.filter(item => item !== concern)
        : [...prev, concern];

      return newSelection.filter(item => item !== noneOfTheAbove);
    });
  };

  return (
    <div className="bg-complementar text-apoio min-h-screen font-sen">
      <div className="max-w-sm mx-auto py-6 px-4 w-full pb-28">
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

        <ProgressBar currentStep={8} totalSteps={8} activeSection={1} />

        {/* Main Content */}
        <div className="text-left">
          <h1 className="text-4xl font-playfair font-bold mb-8 leading-tight">
            ¿Cuáles son tus preocupaciones sobre la piel?
          </h1>

          {/* Concerns Options */}
          <div className="space-y-4">
            {concerns.map(concern => {
              const isSelected = selectedConcerns.includes(concern);
              return (
                <div
                  key={concern}
                  onClick={() => handleSelection(concern)}
                  className={`w-full flex items-center justify-between p-4 border rounded-xl text-lg font-sen transition-all duration-300 cursor-pointer bg-white ${
                    isSelected
                      ? 'border-gray-400 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-bold text-gray-800 flex-1 text-left">{concern}</span>
                  <div className="flex-shrink-0">
                    {isSelected ? <CheckedIcon /> : <UncheckedIcon />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-complementar p-4 border-t border-secundaria">
        <div className="max-w-sm mx-auto">
            <button 
              onClick={onContinue}
              disabled={selectedConcerns.length === 0}
              className="w-full bg-apoio text-complementar py-4 px-6 rounded-xl text-lg font-sen font-bold shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-apoio disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed enabled:hover:bg-opacity-90 enabled:hover:scale-105">
              CONTINUAR
            </button>
        </div>
      </div>
    </div>
  );
};

export default SkinConcernsQuizPage;