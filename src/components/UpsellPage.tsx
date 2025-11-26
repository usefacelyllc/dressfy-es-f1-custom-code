
import React, { useState } from 'react';

interface UpsellPageProps {
  onAccept: () => void;
  onSkip: () => void;
}

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="font-sen font-bold text-gray-800 text-base sm:text-lg">{question}</span>
        <span className="ml-4 text-2xl leading-none text-gray-400 font-light">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-gray-600 font-sen text-sm sm:text-base leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

const UpsellPage: React.FC<UpsellPageProps> = ({ onAccept, onSkip }) => {
  const faqs = [
    {
      question: "¿Esto realmente funciona?",
      answer: "¡Sí! El análisis de colores personales es una ciencia probada utilizada por consultores de imagen en todo el mundo para realzar la belleza natural."
    },
    {
      question: "¿Es complicado de usar?",
      answer: "¡Para nada! Recibirás una guía práctica y visual que es fácil de consultar siempre que lo necesites, ya sea comprando ropa o maquillándote."
    },
    {
      question: "¿Vale la pena la inversión?",
      answer: "Considera cuánto ya has gastado en ropa y maquillaje que no te hacen lucir radiante. ColorMatch se paga a sí mismo con la primera compra confiada que hagas."
    }
  ];

  return (
    <div className="bg-white text-apoio min-h-screen font-sen">
      <div className="max-w-md mx-auto py-8 px-6">
        {/* Header */}
        <header className="text-center mb-8">
          <img 
            src="/assets/logo-dressfy.webp" 
            alt="Dressfy Logo"
            className="h-6 mx-auto"
          />
        </header>

        {/* Hero / Context Section */}
        <div className="text-center mb-10">
           <span className="text-4xl mb-2 block">🤔</span>
           <h1 className="font-playfair text-3xl font-bold mb-4 text-gray-900">
             ¿Aún tienes dudas?
           </h1>
           <p className="text-gray-600 text-sm">
             Miles de mujeres ya están transformando su imagen. Aquí respondemos las preguntas más frecuentes.
           </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-gray-50 rounded-2xl px-6 py-2 mb-10 shadow-sm border border-gray-100">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* Closing Statement */}
        <div className="text-center mb-8">
            <p className="font-playfair text-lg text-gray-800 italic">
                "Tus colores te están esperando. ¿Qué te parece conocerlos hoy?"
            </p>
            <p className="text-xs text-gray-500 mt-4 px-4">
                P.D.: Tu viaje de transformación ya ha comenzado con Dressfy. ColorMatch es el siguiente paso para convertirte en la versión más radiante y confiada de ti misma/o. ¡No dejes pasar esta oportunidad!
            </p>
        </div>

        {/* One-Click Upsell CTA */}
        <div className="text-center sticky bottom-4 z-10">
            <button
                onClick={onAccept}
                className="w-full bg-[#C59A44] text-white py-4 px-6 rounded-xl text-lg font-sen font-bold shadow-lg transition-all duration-300 ease-in-out hover:bg-[#b0893b] hover:scale-105 uppercase tracking-wide mb-3"
            >
                <span className="mr-2">🎨</span> ¡SÍ, QUIERO DESCUBRIR MIS COLORES AHORA!
            </button>
            <p className="text-[10px] text-gray-500 mb-4">
                Al hacer clic, aseguras tu oferta por $37 (Pago único).
            </p>

            <button
                onClick={onSkip}
                className="text-gray-400 text-sm underline hover:text-gray-600 transition-colors"
            >
                Omite esta oferta y continúa
            </button>
        </div>

      </div>
    </div>
  );
};

export default UpsellPage;