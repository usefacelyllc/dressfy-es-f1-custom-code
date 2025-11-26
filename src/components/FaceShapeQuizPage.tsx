import React, { useState, useRef, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import { getExternalImageUrl } from '../utils/imageConfig';

interface FaceShapeQuizPageProps {
  onBack: () => void;
  onContinue: () => void;
}

const FaceShapeQuizPage: React.FC<FaceShapeQuizPageProps> = ({ onBack, onContinue }) => {
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const shapes = [
    { name: 'Ovalada', imageUrl: '/assets/oB0ZXHLZ.webp', description: 'Mandíbula larga, equilibrada, suavemente curvada' },
    { name: 'Cuadrada', imageUrl: '/assets/KsEYz6bB.webp', description: 'Mandíbula angular, frente ancha' },
    { name: 'Redonda', imageUrl: '/assets/L5wqQ55_.webp', description: 'Longitud y ancho iguales, bordes suaves' },
    { name: 'Corazón', imageUrl: '/assets/2Y9Bv_Ax.webp', description: 'Frente ancha, mentón estrecho y puntiagudo' },
    { name: 'Diamante', imageUrl: '/assets/YD1kYcmm.webp', description: 'Mejillas anchas, frente y mandíbula estrechas' },
    { name: 'Rectangular', imageUrl: '/assets/fGt52IYi.webp', description: 'Rostro largo, mandíbula fuerte, lados rectos' },
  ];

  const infoBoxContent: { [key: string]: string } = {
    'Ovalada': 'Destaca tus pómulos y agrega bronzer a lo largo de la línea del cabello para resaltar tus rasgos equilibrados.',
    'Cuadrada': 'Contornea las esquinas de la mandíbula y los bordes de la frente para suavizar los ángulos y resaltar el centro de tu rostro.',
    'Redonda': 'Aplica contorno desde las sienes hasta debajo de los pómulos para crear definición y un efecto adelgazante.',
    'Corazón': 'Agrega sombra a tu mentón y sienes, luego ilumina el centro de la frente y los pómulos para una mejor proporción.',
    'Diamante': 'Sombrea tus pómulos prominentes e ilumina la línea de la mandíbula para suavizar los rasgos afilados.',
    'Rectangular': 'Contornea la parte superior de la frente y la parte inferior del mentón para hacer que tu rostro parezca más corto, con un toque de iluminación en los pómulos.',
  };

  const handleSelection = (shape: string) => {
    setSelectedShape(shape);
  };

  useEffect(() => {
    if (selectedShape && infoRef.current) {
      setTimeout(() => {
        infoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
    }
  }, [selectedShape]);

  return (
    <div className="bg-complementar text-apoio min-h-screen font-sen">
      <div className="max-w-sm mx-auto py-6 px-4 w-full pb-32">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
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

        <ProgressBar currentStep={1} totalSteps={2} activeSection={4} />

        {/* Main Content */}
        <div className="text-left">
          <h1 className="text-4xl font-playfair font-bold mb-8">
            ¿Qué forma tiene tu rostro?
          </h1>

          {/* Options */}
          <div className="space-y-4">
            {shapes.map(({ name, imageUrl }) => {
              const isSelected = selectedShape === name;
              return (
                <button
                  key={name}
                  className={`w-full flex items-center text-left p-4 border rounded-xl text-lg font-sen transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-principal ${
                    isSelected
                      ? 'bg-principal text-complementar border-principal scale-105 shadow-md'
                      : 'bg-complementar border-secundaria text-apoio hover:border-principal'
                  }`}
                  onClick={() => handleSelection(name)}
                >
                  <img 
                    src={imageUrl} 
                    alt={name} 
                    className="w-8 h-8 rounded-full mr-4" 
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      const externalUrl = getExternalImageUrl(imageUrl);
                      if (externalUrl) {
                        img.src = externalUrl;
                      } else {
                        img.style.display = 'none';
                      }
                    }} 
                  />
                  {name}
                </button>
              );
            })}
          </div>

          {/* Helper Text and Info Boxes */}
          <div className="mt-6 space-y-4" ref={infoRef}>
            {shapes.map(({ name, description }) => (
               <div key={name} className={`transition-opacity duration-300 ease-in-out ${selectedShape === name ? 'opacity-100' : 'opacity-0 max-h-0'}`} style={{ overflow: 'hidden' }}>
                    <p className="text-sm text-gray-600">
                        {description}
                    </p>
                    <div className="bg-info-bg p-4 rounded-lg text-left mt-2">
                      <p className="font-bold font-sen text-info-dark mb-1">
                        <span role="img" aria-label="mujer levantando la mano">🙋‍♀️</span> Un consejo para rostros {name.toLowerCase()}
                      </p>
                      <p className="text-sm text-info-dark/80">
                        {infoBoxContent[name]}
                      </p>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Floating Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-complementar p-4 border-t border-secundaria">
        <div className="max-w-sm mx-auto">
            <button 
              onClick={onContinue}
              disabled={!selectedShape}
              className="w-full bg-apoio text-complementar py-4 px-6 rounded-xl text-lg font-sen font-bold shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-apoio disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed enabled:hover:bg-opacity-90 enabled:hover:scale-105">
              CONTINUAR
            </button>
        </div>
      </div>
    </div>
  );
};

export default FaceShapeQuizPage;