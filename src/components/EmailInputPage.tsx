
import React, { useState, useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';

interface EmailInputPageProps {
  onBack: () => void;
  onContinue: () => void;
}

const EmailInputPage: React.FC<EmailInputPageProps> = ({ onBack, onContinue }) => {
  const { quizData, updateQuizData } = useQuiz();
  const [email, setEmail] = useState(quizData.email || '');
  
  // Update local state if quizData.email changes
  useEffect(() => {
    if (quizData.email) {
      setEmail(quizData.email);
    }
  }, [quizData.email]);

  const isEmailValid = (email: string) => {
    // simple regex for email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

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
          <h1 className="text-4xl font-playfair font-bold">
            Ingresa el correo electrónico para crear
          </h1>
          <h2 className="text-4xl font-playfair font-bold italic text-gray-700 mb-8">
            tu cuenta de Dressfy
          </h2>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="INGRESA TU CORREO ELECTRÓNICO"
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
              if (isEmailValid(email)) {
                updateQuizData({ email: email.trim() });
                onContinue();
              }
            }}
            disabled={!isEmailValid(email)}
            className="w-full bg-apoio text-complementar py-4 px-6 rounded-xl text-lg font-sen font-bold shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-apoio disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed enabled:hover:bg-opacity-90"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailInputPage;