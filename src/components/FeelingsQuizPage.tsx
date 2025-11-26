import React, { useState } from 'react';
import ProgressBar from './ProgressBar';

interface FeelingsQuizPageProps {
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

const FeelingsQuizPage: React.FC<FeelingsQuizPageProps> = ({ onBack, onContinue }) => {
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const otherOption = 'Otra';
  const feelings = [
    'Confiada/o',
    'Deseable',
    'Atractiva/o',
    'Romántica/o',
    'Joven',
    'Ambiciosa/o',
    'Grasa', 
    otherOption,
  ];

  const handleSelection = (feeling: string) => {
    setSelectedFeelings(prev => {
      if (feeling === otherOption) {
        // "Otra" is exclusive and acts like a single choice toggle
        return prev.includes(otherOption) ? [] : [otherOption];
      }
      
      const newSelection = prev.includes(feeling)
        ? prev.filter(item => item !== feeling)
        : [...prev, feeling];

      // If any other option is selected, "Otra" should be deselected
      return newSelection.filter(item => item !== otherOption);
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

        <ProgressBar currentStep={1} totalSteps={2} activeSection={3} />

        {/* Main Content */}
        <div className="text-left">
          <h1 className="text-4xl font-playfair font-bold mb-8 leading-tight">
            ¿Cómo quieres sentirte cuando ames tu apariencia?
          </h1>

          {/* Feelings Options */}
          <div className="space-y-4">
            {feelings.map(feeling => {
              const isSelected = selectedFeelings.includes(feeling);
              return (
                <div
                  key={feeling}
                  onClick={() => handleSelection(feeling)}
                  className={`w-full flex items-center justify-between p-4 border rounded-xl text-lg font-sen transition-all duration-300 cursor-pointer bg-white ${
                    isSelected
                      ? 'border-gray-400 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-bold text-gray-800 flex-1 text-left">{feeling}</span>
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
              disabled={selectedFeelings.length === 0}
              className="w-full bg-apoio text-complementar py-4 px-6 rounded-xl text-lg font-sen font-bold shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-apoio disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed enabled:hover:bg-opacity-90 enabled:hover:scale-105">
              CONTINUAR
            </button>
        </div>
      </div>
    </div>
  );
};

export default FeelingsQuizPage;