import React, { useState, useRef, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import { getExternalImageUrl } from '../utils/imageConfig';

interface SkinTypeQuizPageProps {
  onBack: () => void;
  onContinue: () => void;
}

const SkinTypeQuizPage: React.FC<SkinTypeQuizPageProps> = ({ onBack, onContinue }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const skinTypes = [
    { name: 'Grasa', icon: '/assets/crszRH9X.webp', description: 'Piel brillante, poros activos' },
    { name: 'Seca', icon: '/assets/aOKMwzmk.webp', description: 'Superficie tirante, textura reseca' },
    { name: 'Normal', icon: '/assets/2YMtmMYO.webp', description: 'Tono equilibrado, acabado suave' },
    { name: 'Mixta', icon: '/assets/c24NeK8N.webp', description: 'Zona T grasa, bordes más secos' },
  ];
  
  const infoBoxContent: { [key: string]: string } = {
    'Grasa': 'Los tipos de piel grasa necesitan un cuidado diferente para lucir lo mejor posible. Lo que funciona para otra persona puede no funcionar para ti.',
    'Seca': 'Los tipos de piel seca necesitan un cuidado diferente para lucir lo mejor posible. Lo que funciona para otra persona puede no funcionar para ti.',
    'Normal': 'Los diferentes tipos de piel necesitan un cuidado diferente para lucir lo mejor posible. Lo que funciona para otra persona puede no funcionar para ti.',
    'Mixta': 'Los tipos de piel mixta necesitan un cuidado diferente para lucir lo mejor posible. Lo que funciona para otra persona puede no funcionar para ti.',
  };

  const handleSelection = (type: string) => {
    setSelectedType(type);
  };

  useEffect(() => {
    if (selectedType && infoRef.current) {
      setTimeout(() => {
        infoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
    }
  }, [selectedType]);

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

        <ProgressBar currentStep={2} totalSteps={3} activeSection={2} />

        {/* Main Content */}
        <div className="text-left">
          <h1 className="text-4xl font-playfair font-bold mb-8">
            ¿Cuál es tu tipo de piel?
          </h1>

          {/* Options */}
          <div className="space-y-4">
            {skinTypes.map(({ name, icon }) => {
              const isSelected = selectedType === name;
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
                    src={icon} 
                    alt={name} 
                    className="w-8 h-8 rounded-full mr-4" 
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      const externalUrl = getExternalImageUrl(icon);
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
            {skinTypes.map(({ name, description }) => (
               <div key={name} className={`transition-opacity duration-300 ease-in-out ${selectedType === name ? 'opacity-100' : 'opacity-0 max-h-0'}`} style={{ overflow: 'hidden' }}>
                    <p className="text-sm text-gray-600">
                        <strong>{name} =</strong> {description}
                    </p>
                    <div className="bg-info-bg p-4 rounded-lg text-left mt-2">
                      <p className="font-bold font-sen text-info-dark mb-1">
                        <span role="img" aria-label="mujer recibiendo masaje">💆‍♀️</span> Te tenemos cubierto
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
              disabled={!selectedType}
              className="w-full bg-apoio text-complementar py-4 px-6 rounded-xl text-lg font-sen font-bold shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-apoio disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed enabled:hover:bg-opacity-90 enabled:hover:scale-105">
              CONTINUAR
            </button>
        </div>
      </div>
    </div>
  );
};

export default SkinTypeQuizPage;