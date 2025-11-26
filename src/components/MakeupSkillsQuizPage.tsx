import React, { useState, useRef, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import { useQuiz } from '../context/QuizContext';

interface MakeupSkillsQuizPageProps {
  onBack: () => void;
  onContinue: () => void;
}

const MakeupSkillsQuizPage: React.FC<MakeupSkillsQuizPageProps> = ({ onBack, onContinue }) => {
  const { quizData, updateQuizData } = useQuiz();
  const [selectedOption, setSelectedOption] = useState<string | null>(quizData.makeupSkills || null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const skills = [
    { level: 'Principiante', description: 'No estoy segura/o de qué productos de maquillaje usar' },
    { level: 'Novata/o', description: 'Conozco los productos básicos pero me cuesta con las técnicas' },
    { level: 'Intermedia/o', description: 'Me manejo con el maquillaje diario pero me cuesta con los looks especiales' },
    { level: 'Competente', description: 'Domino las técnicas básicas pero busco habilidades avanzadas' },
    { level: 'Experta/o', description: 'Soy una experta/o en maquillaje, pero anhelo nueva inspiración' },
  ];

  const handleSelection = (level: string) => {
    setSelectedOption(level);
    updateQuizData({ makeupSkills: level });
  };

  useEffect(() => {
    if (selectedOption && descriptionRef.current) {
      setTimeout(() => {
        descriptionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
    }
  }, [selectedOption]);

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

        {/* Progress Bar - New section 5 */}
        <ProgressBar currentStep={1} totalSteps={1} activeSection={5} totalSections={5} />

        {/* Main Content */}
        <div className="text-left">
          <h1 className="text-3xl font-playfair font-bold mb-6 leading-tight">
            ¿Cuáles son tus habilidades en maquillaje?
          </h1>

          <div className="space-y-4">
            {skills.map(({ level }) => {
              const isSelected = selectedOption === level;
              return (
                <button
                  key={level}
                  className={`w-full text-left p-4 border rounded-xl text-lg font-sen transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-principal ${
                    isSelected
                      ? 'bg-principal text-complementar border-principal scale-105 shadow-md'
                      : 'bg-complementar border-secundaria text-apoio hover:border-principal'
                  }`}
                  onClick={() => handleSelection(level)}
                >
                  {level}
                </button>
              );
            })}
          </div>

          {/* Conditional Description Text */}
           <div className="mt-8 relative min-h-[6rem]" ref={descriptionRef}>
            {skills.map(({ level, description }) => (
              <div 
                key={level}
                className={`absolute top-0 left-0 transition-opacity duration-300 ease-in-out w-full ${selectedOption === level ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                  <p className="text-base leading-relaxed text-gray-600">
                      {description}
                  </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Sticky Footer Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-complementar p-4 border-t border-secundaria">
        <div className="max-w-sm mx-auto">
            <button 
              onClick={onContinue}
              disabled={!selectedOption}
              className="w-full bg-apoio text-complementar py-4 px-6 rounded-xl text-lg font-sen font-bold shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-apoio disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed enabled:hover:bg-opacity-90 enabled:hover:scale-105 uppercase"
            >
              CONTINUAR
            </button>
        </div>
      </div>
    </div>
  );
};

export default MakeupSkillsQuizPage;