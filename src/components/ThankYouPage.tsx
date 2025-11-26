
import React from 'react';

interface ThankYouPageProps {
  onHome: () => void;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({ onHome }) => {
  return (
    <div className="bg-white text-apoio min-h-screen font-sen flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="font-playfair text-4xl font-bold mb-4 text-gray-900">
          ¡Gracias por tu orden!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Tu acceso al plan personalizado y a ColorMatch ha sido enviado a tu correo electrónico.
        </p>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8">
          <p className="text-sm text-gray-500 mb-2">Número de orden:</p>
          <p className="font-bold text-xl tracking-wider">#ORD-{Math.floor(100000 + Math.random() * 900000)}</p>
        </div>

        <button
          onClick={onHome}
          className="w-full bg-apoio text-white py-4 px-6 rounded-xl text-lg font-bold shadow-lg hover:bg-gray-800 transition-all uppercase tracking-wide"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
