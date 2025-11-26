
import React, { useState, useEffect, useMemo } from 'react';
import { useQuiz } from '../context/QuizContext';

interface PricingPageProps {
  onContinue: (price: string) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onContinue }) => {
  const { quizData, updateQuizData } = useQuiz();
  const [selectedPrice, setSelectedPrice] = useState<string | null>(quizData.selectedPrice || '$13.67');
  const [timeLeft, setTimeLeft] = useState(119); // 119 seconds (approx 2 mins)
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  // Memoize the URL to prevent iframe reloading on every timer tick
  const policyUrl = useMemo(() => `https://www.dressfy.app/cancellation-policy?t=${Date.now()}`, []);

  useEffect(() => {
    if (timeLeft === 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isPolicyOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPolicyOpen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const prices = ['$0.15', '$7.50', '$9', '$13.67'];

  const handlePriceSelection = (price: string) => {
    setSelectedPrice(price);
  };

  const handleContinue = () => {
    if (selectedPrice) {
      // Save to context
      updateQuizData({ selectedPrice });
      onContinue(selectedPrice);
    }
  };

  return (
    <div className="bg-complementar text-apoio min-h-screen font-sen pb-32 relative">
      <div className="max-w-sm mx-auto py-6 px-4">
        <header className="text-center mb-6">
          <img 
            src="/assets/logo-dressfy.webp" 
            alt="Dressfy Logo"
            className="h-6 mx-auto"
          />
        </header>

        <section className="text-center">
          <h1 className="font-playfair text-4xl font-bold mb-4">Elige un precio de prueba</h1>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">TU SATISFACCIÓN NOS IMPORTA</h2>
            <p className="text-gray-600">
              Hemos ayudado a miles de personas a <strong>explorar su propósito y misión</strong>, y queremos ayudarte a ti también.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">TU AHORRO, NUESTRA PRIORIDAD</h2>
            <div className="grid grid-cols-2 gap-4">
              {prices.map(price => {
                const isSelected = selectedPrice === price;
                return (
                  <button
                    key={price}
                    onClick={() => handlePriceSelection(price)}
                    className={`p-6 border-2 rounded-xl text-2xl font-bold transition-all duration-200 shadow-sm ${
                      isSelected 
                        ? 'bg-apoio text-complementar border-apoio scale-105 shadow-md'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {price}
                  </button>
                )
              })}
            </div>
          </div>
          
          <div className="text-sm text-gray-600 space-y-3 mb-8 text-left leading-relaxed">
              <p>
                  Disfruta de tu prueba de 07 días — después de eso, solo <strong>$2.23/día</strong> por un mes completo de acceso.
              </p>
              <p>
                  <strong>Puedes cancelar tu suscripción en cualquier momento</strong> si no estás satisfecho. Aunque el costo real de la prueba es de <strong>$13.67</strong>, te animamos a elegir un monto con el que te sientas cómodo. Esta opción nos ayuda a apoyar a quienes necesitan seleccionar los precios de prueba más bajos.
              </p>
              <p>
                  Después de la prueba, tu suscripción se renovará automáticamente a <strong>$67/mes</strong> a menos que la canceles.
              </p>
          </div>

          {/* Guarantee Section - Optimized for Trust & Conversion */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left shadow-sm mb-6 relative overflow-hidden">
            {/* Decorative background accent */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-green-100 rounded-full opacity-50 blur-xl"></div>
            
            <div className="flex items-start gap-3 relative z-10">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                   <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                   </svg>
                </div>
              </div>
              <div>
                <h2 className="font-playfair text-xl font-bold mb-2 text-gray-900">
                  Garantía de reembolso de 30 días
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Confiamos en que nuestro desafío traerá resultados reales para ti. Si el contenido presenta fallas o información totalmente imprecisa, <strong>te devolvemos el dinero</strong>. 
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Consulta los detalles y limitaciones en la{' '}
                  <button 
                    onClick={() => setIsPolicyOpen(true)}
                    className="text-apoio font-bold underline hover:text-gray-700 transition-colors focus:outline-none"
                  >
                    política de reembolsos
                  </button>.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <p className="text-xs text-gray-400 font-sen">
              ¿Necesitas ayuda? Contáctanos en <a href="mailto:support@dressfy.app" className="underline hover:text-gray-600">support@dressfy.app</a>
            </p>
          </div>

        </section>
      </div>
      
      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-complementar p-4 border-t border-secundaria shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-sm mx-auto text-center">
            
            {/* Timer Section Logic */}
            {timeLeft > 0 ? (
                <div className="flex justify-center items-center text-sm mb-3 bg-red-50 py-1 px-3 rounded-full w-fit mx-auto">
                    <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-gray-700 mr-1">Tu oferta termina en:</span>
                    <span className="font-bold text-red-600 tabular-nums">{formatTime(timeLeft)}</span>
                </div>
            ) : (
                <div className="flex justify-center items-center text-sm mb-3 w-fit mx-auto">
                    <span className="font-bold text-red-600">Finalizado, asegura tu acceso ahora.</span>
                </div>
            )}

            <button 
              onClick={handleContinue}
              disabled={!selectedPrice}
              className="w-full bg-apoio text-complementar py-4 px-6 rounded-xl text-lg font-sen font-bold shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-apoio disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed enabled:hover:bg-gray-800 enabled:active:scale-[0.98]"
            >
              Asegurar mi suscripción
            </button>
        </div>
      </div>

      {/* Refund Policy Modal */}
      {isPolicyOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsPolicyOpen(false)}
          ></div>

          {/* Modal Dialog */}
          <div className="relative bg-white w-full max-w-3xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
              <h3 className="font-playfair font-bold text-lg ml-2">Política de Reembolso</h3>
              <button 
                onClick={() => setIsPolicyOpen(false)}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors focus:outline-none"
                aria-label="Cerrar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Content (Iframe) */}
            <div className="flex-1 bg-gray-50 w-full relative">
               <iframe
                  src={policyUrl}
                  title="Política de reembolsos — Dressfy"
                  className="w-full h-full border-0"
                  loading="lazy"
               ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PricingPage;