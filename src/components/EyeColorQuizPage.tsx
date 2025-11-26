import React, { useState, useRef, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import { useQuiz } from '../context/QuizContext';

interface EyeColorQuizPageProps {
  onBack: () => void;
  onContinue: () => void;
}

const EyeColorQuizPage: React.FC<EyeColorQuizPageProps> = ({ onBack, onContinue }) => {
  const { quizData, updateQuizData } = useQuiz();
  const [selectedColor, setSelectedColor] = useState<string | null>(quizData.eyeColor || null);
  const infoBoxRef = useRef<HTMLDivElement>(null);

  const eyeColors = [
    { name: 'Azules', color: '#5B9BD5' },
    { name: 'Verdes', color: '#70AD47' },
    { name: 'Miel', color: '#BF8F00' },
    { name: 'Marrones', color: '#996633' },
  ];

  const handleColorSelection = (colorName: string) => {
    setSelectedColor(colorName);
    updateQuizData({ eyeColor: colorName });
  };

  useEffect(() => {
    if (selectedColor) {
      setTimeout(() => {
        infoBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [selectedColor]);

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

        <ProgressBar currentStep={2} totalSteps={8} activeSection={1} />

        {/* Main Content */}
        <div className="text-left">
          <h1 className="text-4xl font-playfair font-bold mb-8">
            ¿De qué color son tus ojos?
          </h1>

          {/* Eye Color Options */}
          <div className="space-y-4">
            {eyeColors.map(({ name, color }) => {
              const isSelected = selectedColor === name;
              return (
                <button
                  key={name}
                  className={`w-full flex items-center text-left p-4 border rounded-xl text-lg font-sen transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-principal ${
                    isSelected
                      ? 'bg-principal text-complementar border-principal scale-105 shadow-md'
                      : 'bg-complementar border-secundaria text-apoio hover:border-principal'
                  }`}
                  onClick={() => handleColorSelection(name)}
                >
                  <span className="w-6 h-6 rounded-md mr-4" style={{ backgroundColor: color }}></span>
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        {/* "Sabías?" Box (in main flow) */}
        <div ref={infoBoxRef} className={`transition-all duration-500 ease-in-out mt-8 ${selectedColor ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'}`} style={{ overflow: 'hidden' }}>
            <div className="bg-gray-100 p-4 rounded-lg text-left">
              <p className="font-bold font-sen text-apoio mb-1">
                <span role="img" aria-label="emoji pensativo">😌</span> ¿Sabías?
              </p>
              <p className="text-sm text-gray-700">
                El color de tus ojos es un indicador importante para determinar tu paleta de colores ideal.
              </p>
            </div>
        </div>
      </div>

      {/* Floating Footer for the button only */}
      <div className="fixed bottom-0 left-0 right-0 bg-complementar p-4 border-t border-secundaria">
          <div className="max-w-sm mx-auto">
            <button 
              onClick={onContinue}
              disabled={!selectedColor}
              className="w-full bg-apoio text-complementar py-4 px-6 rounded-xl text-lg font-sen font-bold shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-apoio disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed enabled:hover:bg-opacity-90 enabled:hover:scale-105">
              CONTINUAR
            </button>
          </div>
      </div>
    </div>
  );
};

export default EyeColorQuizPage;