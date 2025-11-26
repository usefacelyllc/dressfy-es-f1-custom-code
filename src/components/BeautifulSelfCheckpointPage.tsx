
import React from 'react';

interface BeautifulSelfCheckpointPageProps {
  onContinue: () => void;
}

const BeautifulSelfCheckpointPage: React.FC<BeautifulSelfCheckpointPageProps> = ({ onContinue }) => {
  return (
    <div 
      className="relative h-screen w-full bg-cover bg-center font-sen text-white flex flex-col justify-end overflow-hidden"
      style={{ backgroundImage: "url('/assets/k-R-F7Fy-R.webp')" }}
    >
      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 p-6 pb-12 text-left max-w-sm mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-playfair font-bold mb-4 leading-tight">
          Estás en camino hacia tu yo <span className="italic">más hermoso</span>.
        </h1>
        
        <p className="text-base sm:text-lg text-white/90 mb-8 leading-relaxed">
          Guardemos de forma segura tu perfil para recibir recomendaciones que se ajusten a tus preferencias.
        </p>

        <button
          onClick={onContinue}
          className="w-full bg-transparent border border-white text-white py-4 px-6 rounded-none text-lg font-sen font-medium tracking-wider hover:bg-white/10 transition-all duration-300 uppercase"
        >
          CONTINUAR
        </button>
      </div>
    </div>
  );
};

export default BeautifulSelfCheckpointPage;