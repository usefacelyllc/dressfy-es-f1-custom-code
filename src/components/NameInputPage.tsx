
import React, { useState, useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';

interface NameInputPageProps {
  onBack: () => void;
  onContinue: () => void;
}

const NameInputPage: React.FC<NameInputPageProps> = ({ onBack, onContinue }) => {
  const { quizData, updateQuizData } = useQuiz();
  const [name, setName] = useState(quizData.name || '');
  
  // Update local state if quizData.name changes
  useEffect(() => {
    if (quizData.name) {
      setName(quizData.name);
    }
  }, [quizData.name]);

  return (
    <div className="bg-complementar text-apoio min-h-screen font-sen flex flex-col">
      <div className="max-w-sm mx-auto py-6 px-4 flex-grow w-full flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
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

        {/* Main Content */}
        <div className="text-left flex-grow">
          <h1 className="text-4xl font-playfair font-bold mb-4">
            Por favor, cuéntanos más sobre ti.
          </h1>
          <h2 className="text-3xl font-playfair mb-8">
            ¿Cuál es tu nombre?
          </h2>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            className="w-full p-4 bg-complementar text-apoio placeholder-gray-500 border border-apoio rounded-xl text-lg font-sen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-principal"
          />

          <p className="text-xs text-gray-500 mt-4">
            <span role="img" aria-label="lock">🔒</span> Respetamos su privacidad y estamos comprometidos en proteger sus datos personales.
          </p>
        </div>

        {/* Footer */}
        <div className="w-full">
            <button 
              onClick={() => {
                if (name.trim() !== '') {
                  updateQuizData({ name: name.trim() });
                  onContinue();
                }
              }}
              disabled={name.trim() === ''}
              className="w-full bg-apoio text-complementar py-4 px-6 rounded-xl text-lg font-sen font-bold shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-apoio disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed enabled:hover:bg-opacity-90 enabled:hover:scale-105">
              CONTINUAR
            </button>
        </div>
      </div>
    </div>
  );
};

export default NameInputPage;