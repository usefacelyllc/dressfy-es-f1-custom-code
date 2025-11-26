import React, { useState } from 'react';
import { getExternalImageUrl } from '../utils/imageConfig';

interface EarlyPossibilityCheckpointPageProps {
  onContinue: () => void;
}

const EarlyPossibilityCheckpointPage: React.FC<EarlyPossibilityCheckpointPageProps> = ({ onContinue }) => {
  const [bgImage, setBgImage] = useState('/assets/4nm4IJLN.webp');
  
  React.useEffect(() => {
    const img = new Image();
    img.onerror = () => {
      const externalUrl = getExternalImageUrl('/assets/4nm4IJLN.webp');
      if (externalUrl) {
        setBgImage(externalUrl);
      }
    };
    img.src = '/assets/4nm4IJLN.webp';
  }, []);

  return (
    <div
      className="relative bg-cover bg-center h-screen w-full flex flex-col justify-end text-complementar font-sen"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      {/* Gradient overlay for text readability */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent"></div>

      {/* Content container */}
      <div className="relative z-10 p-6 text-center">
        <h2 className="text-3xl font-bold font-sen mb-4 text-white leading-tight">
          Hasta ahora, hay un 71% de posibilidad de que puedas lucir más joven.
        </h2>
        <p className="text-base text-white/90 mb-8">
          Podemos mejorar tus posibilidades. Conozcamos mejor tu rostro para ver si tienes aún más potencial.
        </p>

        {/* Continue button */}
        <button
          onClick={onContinue}
          className="w-full max-w-sm mx-auto bg-transparent text-complementar py-4 px-6 rounded-xl text-lg font-sen font-bold transition-all duration-300 ease-in-out border border-complementar focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-complementar hover:bg-white/20 hover:scale-105"
        >
          CONTINUAR
        </button>
      </div>
    </div>
  );
};

export default EarlyPossibilityCheckpointPage;