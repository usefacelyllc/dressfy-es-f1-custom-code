import React, { useState } from 'react';

interface MakefyQuizPageProps {
  onContinue: () => void;
}

const MakefyQuizPage: React.FC<MakefyQuizPageProps> = ({ onContinue }) => {
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <div className="bg-complementar text-apoio min-h-screen font-sen overflow-hidden relative">
      {/* Main content container */}
      <div className="max-w-sm mx-auto py-8 px-4 flex flex-col items-center text-center min-h-screen justify-between">
        
        <header className="w-full pt-4">
            {/* 1. Logo */}
            <img 
              src="/assets/logo-dressfy.webp" 
              alt="Dressfy Logo"
              className="h-6 mx-auto"
            />
        </header>

        <div className="flex flex-col items-center flex-grow justify-center w-full">
            {/* Headline */}
            <div className="font-ebGaramond text-3xl md:text-5xl font-extrabold mb-6 text-center w-full h-[80px] md:h-[120px] flex items-center justify-center">
                <div className="relative h-[40px] md:h-[60px] w-full flex justify-center items-center">
                    <span className="phrase">Encuentra Tu Estilo Único</span>
                    <span className="phrase">Descubre Cuán Joven Lucirás</span>
                    <span className="phrase">Luce Más Atractivo</span>
                </div>
            </div>

            {/* 2. Image */}
            <div className="mb-6 w-full max-w-[280px]">
              <img
                src="/assets/person.webp"
                srcSet="/assets/person.webp 1x, /assets/person.webp 2x"
                alt="Análisis facial"
                className="rounded-xl w-full h-auto shadow-sm object-cover"
                loading="eager"
                fetchpriority="high"
              />
            </div>

            {/* 3. Subtitle */}
            <p className="text-lg font-sen mb-8">
              con un plan basado en el análisis facial
            </p>

            {/* 4. Continue Button */}
            <button 
              onClick={onContinue}
              className="w-full bg-apoio text-complementar py-4 px-6 rounded-xl text-lg font-sen font-bold shadow-md hover:bg-opacity-90 hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-apoio uppercase tracking-wide">
              CONTINUAR
            </button>

             {/* 5. Legal Text */}
             <p className="text-[10px] text-gray-500 mt-4 px-2 font-sen leading-tight">
              Al continuar, acepto la{' '}
              <a href="#" className="underline hover:text-apoio">
                Política de Privacidad
              </a>{' '}
              y los{' '}
              <a href="#" className="underline hover:text-apoio">
                Términos de Uso
              </a>{' '}
              de Dressfy.
            </p>
        </div>
      </div>

      {/* 6. Discrete Floating Support Button (UX Standard) */}
      <button 
        onClick={() => setIsSupportOpen(true)}
        className="fixed bottom-6 right-6 bg-black text-white rounded-xl w-12 h-12 flex items-center justify-center shadow-lg hover:bg-gray-800 hover:scale-105 transition-all duration-300 z-50"
        aria-label="Soporte"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
      </button>

      {/* Support Modal */}
      {isSupportOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
            onClick={() => setIsSupportOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xs text-center relative font-sen z-[1000] animate-fade-in-up">
            <button
              onClick={() => setIsSupportOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-bold cursor-pointer hover:bg-gray-200 transition-colors"
            >
              &times;
            </button>
            <div className="mb-4 flex justify-center">
               <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
               </div>
            </div>
            <h2 className="text-xl text-gray-900 mb-2 font-bold">¿Necesitas ayuda?</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Envíanos tus dudas o comentarios por correo electrónico:
            </p>
            <a href="mailto:support@dressfy.app" className="block w-full bg-apoio text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
              support@dressfy.app
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakefyQuizPage;