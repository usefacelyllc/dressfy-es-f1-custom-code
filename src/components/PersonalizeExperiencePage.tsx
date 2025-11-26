
import React, { useState, useEffect } from 'react';

interface PersonalizeExperiencePageProps {
  onBack: () => void;
  onContinue: () => void;
  onSkip: () => void;
}

const PersonalizeExperiencePage: React.FC<PersonalizeExperiencePageProps> = ({ onBack, onContinue, onSkip }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Preload da imagem para melhor performance
    const img = new Image();
    img.src = '/assets/person-scan-face.png';
    img.onload = () => setImageLoaded(true);
  }, []);

  return (
    <div className="bg-complementar text-apoio h-screen font-sen flex flex-col overflow-hidden">
      <div className="max-w-sm mx-auto w-full flex flex-col h-full px-4 py-4">
        {/* Header */}
        <header className="flex items-center justify-between flex-shrink-0 mb-4">
          <button 
            onClick={onBack} 
            className="text-2xl p-2 -ml-2 hover:opacity-75 active:scale-95 transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300" 
            aria-label="Voltar"
          >
            &lt;
          </button>
          <img 
            src="/assets/logo-dressfy.webp" 
            alt="Dressfy Logo"
            className="h-5"
          />
          <div className="w-8"></div>
        </header>

        {/* Main Content Container */}
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          
          {/* Text Content - Melhor espaçamento */}
          <div className="flex-shrink-0 text-left mb-6">
            <h1 className="text-2xl sm:text-3xl font-playfair font-bold mb-3 leading-tight text-gray-900">
              Vamos a personalizar tu experiencia perfectamente
            </h1>
            <p className="text-sm sm:text-base text-gray-700 font-sen leading-relaxed">
              Escanear tu rostro proporciona información valiosa para revelar tu yo más hermoso. Es rápido y completamente privado: tu escaneo permanece <span className="font-bold italic text-gray-900">confidencial y nunca es visto por otros</span>.
            </p>
          </div>

          {/* Image Section - Com animação de entrada */}
          <div className="flex flex-col items-center my-4 w-full">
            <div 
              className={`relative w-full max-w-[280px] flex justify-center items-center overflow-hidden bg-gray-200 rounded-t-[40px] transition-all duration-500 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
                 
                 <img 
                   src="/assets/person-scan-face.png" 
                   alt="Face Scan" 
                   className={`w-full h-auto object-contain transition-transform duration-300 ${
                     isHovering ? 'scale-105' : 'scale-100'
                   }`}
                   loading="eager"
                   fetchpriority="high"
                 />
                 
                 {/* Gradient Fade melhorado */}
                 <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-20"></div>

                 {/* Scan Overlay - Com animação mais suave */}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    <div className={`w-[160px] h-[190px] relative opacity-100 transition-all duration-300 ${
                      isHovering ? 'scale-105' : 'scale-100'
                    }`}>
                        {/* Corner brackets com glow sutil */}
                        <div className="absolute top-0 left-0 w-7 h-7 border-t-4 border-l-4 border-white rounded-tl-2xl drop-shadow-lg shadow-white/50"></div>
                        <div className="absolute top-0 right-0 w-7 h-7 border-t-4 border-r-4 border-white rounded-tr-2xl drop-shadow-lg shadow-white/50"></div>
                        <div className="absolute bottom-0 left-0 w-7 h-7 border-b-4 border-l-4 border-white rounded-bl-2xl drop-shadow-lg shadow-white/50"></div>
                        <div className="absolute bottom-0 right-0 w-7 h-7 border-b-4 border-r-4 border-white rounded-br-2xl drop-shadow-lg shadow-white/50"></div>
                        
                        {/* Scanning Line Animation melhorada */}
                         <div className="absolute left-0 right-0 h-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
                    </div>
                 </div>
            </div>
            
            {/* Social Proof - Melhor destaque */}
            <p className="text-center text-xs sm:text-sm font-bold text-gray-800 mt-3 flex-shrink-0 relative z-10">
               <span className="inline-flex items-center gap-1">
                 <span className="text-base">✨</span>
                 <span>93.451 personas como tú ya escanearon su rostro</span>
               </span>
            </p>
          </div>

          {/* Buttons Section - Melhor hierarquia */}
          <div className="flex-shrink-0 space-y-3 pb-2 mt-auto relative z-20">
             {/* Botão principal - Mais proeminente */}
             <button 
                onClick={onContinue}
                className="w-full bg-apoio text-complementar py-4 px-6 rounded-xl text-base font-sen font-bold shadow-lg hover:shadow-xl hover:bg-gray-800 active:scale-98 transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-offset-2 uppercase tracking-wider"
             >
                HAGÁMOSLO
             </button>
             
             {/* Botão secundário - Menos proeminente */}
             <button 
                onClick={onSkip}
                className="w-full bg-[#F3F4F6] text-gray-700 py-3 px-6 rounded-xl text-base font-sen font-semibold hover:bg-gray-200 active:scale-98 transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 uppercase tracking-wide"
             >
                HÁGALO MÁS TARDE
             </button>

             {/* Privacy Notice - Melhor destaque visual */}
             <div className="flex items-start gap-2 mt-3 px-2 py-2 bg-gray-50 rounded-lg border border-gray-100">
                <span role="img" aria-label="lock" className="text-base mt-0.5 flex-shrink-0">🔒</span>
                <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed font-medium">
                   <span className="font-bold text-gray-800">Tu privacidad es nuestra prioridad.</span> Permanecerás anónimo/a: nadie verá tu rostro cuando lo escanees.
                </p>
             </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 85%; opacity: 0; }
        }
        
        /* Smooth scroll para mobile */
        @media (max-width: 640px) {
          .overflow-y-auto {
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </div>
  );
};

export default PersonalizeExperiencePage;