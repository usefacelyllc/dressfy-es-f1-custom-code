import React, { useState } from 'react';
import { getExternalImageUrl } from '../utils/imageConfig';

interface CheckpointPageProps {
  onContinue: () => void;
}

const CheckpointPage: React.FC<CheckpointPageProps> = ({ onContinue }) => {
  const [bgImage, setBgImage] = useState('/assets/q2W1jFyh.webp');
  
  // Tenta carregar a imagem local, se falhar usa externa
  React.useEffect(() => {
    const img = new Image();
    img.onerror = () => {
      const externalUrl = getExternalImageUrl('/assets/q2W1jFyh.webp');
      if (externalUrl) {
        setBgImage(externalUrl);
      }
    };
    img.src = '/assets/q2W1jFyh.webp';
  }, []);

  return (
    <div
      className="relative bg-cover bg-center h-screen w-full flex flex-col justify-between p-6 text-complementar font-sen"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      {/* Gradient overlay for text readability */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-black/60 to-transparent"></div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Text content positioned at the top */}
        <div className="flex-grow flex flex-col items-center justify-start text-center pt-16">
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold mb-4">
            No estás sola
          </h1>
          <p className="text-base sm:text-lg font-bold tracking-wider uppercase max-w-xs">
            HEMOS AYUDADO A 670,329 MUJERES CON PREOCUPACIONES SIMILARES.
          </p>
        </div>

        {/* Continue button positioned at the bottom */}
        <div className="w-full max-w-sm mx-auto">
          <button
            onClick={onContinue}
            className="w-full bg-complementar text-apoio py-4 px-6 rounded-xl text-lg font-sen font-bold shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-complementar hover:bg-gray-100 hover:scale-105"
          >
            CONTINUAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckpointPage;