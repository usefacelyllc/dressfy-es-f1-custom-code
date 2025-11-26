
import React, { useState, useEffect } from 'react';

interface AnalysisPageProps {
  onComplete: () => void;
}

const ProgressBarItem: React.FC<{ label: string; initialPercentage: number; finalPercentage: number; duration: number; delay: number }> = ({ label, initialPercentage, finalPercentage, duration, delay }) => {
  const [percentage, setPercentage] = useState(initialPercentage);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let start: number | null = null;
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const currentPercentage = initialPercentage + progress * (finalPercentage - initialPercentage);
        setPercentage(Math.floor(currentPercentage));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timeout);
  }, [initialPercentage, finalPercentage, duration, delay]);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="font-sen">{label}</span>
        <span className="font-sen font-bold">{percentage}% {percentage < 100 && <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 ml-1"></span>}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-apoio h-2.5 rounded-full" style={{ width: `${percentage}%`, transition: 'width 0.2s linear' }}></div>
      </div>
    </div>
  );
};

const AnalysisPage: React.FC<AnalysisPageProps> = ({ onComplete }) => {
  useEffect(() => {
    const totalDuration = 4500; // Total time on this page
    const timer = setTimeout(() => {
      onComplete();
    }, totalDuration);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="bg-complementar text-apoio min-h-screen font-sen flex flex-col items-center">
      <div className="max-w-sm mx-auto py-6 px-4 w-full">
        {/* Header */}
        <header className="text-center mb-12">
          <img 
            src="/assets/logo-dressfy.webp" 
            alt="Dressfy Logo"
            className="h-6 mx-auto"
          />
        </header>

        {/* Progress Bars */}
        <div className="w-full mb-12">
          <ProgressBarItem label="Analizando tu perfil" initialPercentage={45} finalPercentage={100} duration={1500} delay={0} />
          <ProgressBarItem label="Analizando tus preferencias" initialPercentage={0} finalPercentage={100} duration={1500} delay={1000} />
          <ProgressBarItem label="Identificando tus estilos perfectos" initialPercentage={0} finalPercentage={100} duration={1500} delay={2000} />
          <ProgressBarItem label="Personalizando tu plan" initialPercentage={0} finalPercentage={80} duration={1500} delay={3000} />
        </div>

        {/* Testimonial Section */}
        <div className="text-center mb-8">
          <h2 className="text-5xl font-playfair font-bold text-gray-800">1,5 Millones de Mujeres</h2>
          <p className="text-lg font-bold text-gray-500 tracking-widest mt-1">HAN ELEGIDO DRESSFY</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg w-full">
          <h3 className="font-playfair text-2xl font-bold mb-2">¡Dressfy hizo mi vida mucho más fácil!</h3>
          <div className="flex mb-3">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
          </div>
          <p className="text-gray-600 mb-4">
            Cuando era más joven, nunca tenía que preocuparme por mi edad. Dressfy ha sido esencial para mí porque me ha ayudado a sentirme confiada y elegante.
          </p>
          <p className="font-bold text-right">- Renee Delepine</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;