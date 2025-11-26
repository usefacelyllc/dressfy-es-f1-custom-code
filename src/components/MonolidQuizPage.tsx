import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import { useQuiz } from '../context/QuizContext';

interface MonolidQuizPageProps {
  onBack: () => void;
  onContinue: () => void;
}

// Icon for "Sí" (Monolid - no visible crease)
const MonolidIcon = ({ selected }: { selected: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 36 36.000001"
    preserveAspectRatio="xMidYMid meet"
    version="1.0"
    className={`w-12 h-12 mr-4 flex-shrink-0 transition-all duration-300 ${selected ? 'brightness-0 invert' : ''}`}
  >
    <defs>
      <filter x="0%" y="0%" width="100%" height="100%" id="22b2a9d178">
        <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" colorInterpolationFilters="sRGB" />
      </filter>
      <filter x="0%" y="0%" width="100%" height="100%" id="94641bb61b">
        <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.2126 0.7152 0.0722 0 0" colorInterpolationFilters="sRGB" />
      </filter>
      <clipPath id="63de135133">
        <path d="M 0.488281 0 L 35.511719 0 L 35.511719 35 L 0.488281 35 Z M 0.488281 0 " clipRule="nonzero" />
      </clipPath>
      <mask id="3c95f89cbc">
        <g filter="url(#22b2a9d178)">
          <g filter="url(#94641bb61b)" transform="matrix(0.72973, 0, 0, 0.72973, 0.486486, 0.00000194595)">
            <image x="0" y="0" width="48" height="48" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAAAAAByaaZbAAAAAmJLR0QA/4ePzL8AAADNSURBVEiJY2AYBaNgFJANGLGKqqlJMLy4dYtIDTop6jevvGCQ0FG/OecKEXYWTNCBa51QQIQNrL9Z3V2EGRgY3q45+Zv1N7o0E4aG3z6bVKa9VVV9O81kkw2GeiygeQIrw4QCBoaCCQysizGdhAEKmhkYWE8wMDAwnGBlYMDiCXRwQhpZg9oJQupZdbZLM8CcxCB9Qo2wm3S2hzOwTjhxYgIra/h2TPVYgpUh2/3MyQ8MAuYmO6dihhL2pKGjLcnw/DzWpDEKRsEoGNQAAAKSNksgXJZOAAAAAElFTkSuQmCC" preserveAspectRatio="xMidYMid meet" />
          </g>
        </g>
      </mask>
    </defs>
    <g clipPath="url(#63de135133)">
      <g mask="url(#3c95f89cbc)">
        <g transform="matrix(0.72973, 0, 0, 0.72973, 0.486486, 0.00000194595)">
          <image x="0" y="0" width="48" height="48" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAAABmJLR0QA/wD/AP+gvaeTAAABHUlEQVRYhe2VQY7CMAxFn50yiPufFkrjWQSnaVmAO4LN+C0qK4rTL/vHgSRJkiRJkv+N/Cn7DOJnGJivX78s6MfzBAwKAHUQ1INb+OwSzrhsdSgYVNfHNphg+bSglqSwPJVk/LZW3oc9nxKkcAOBGaYnHS2YfYOGBcU9NIGAbhe7oxUqiFuqd/NtghW6gLqa62DtnbIZLVjTfYrZSF9v2dEvebOIeIwX6Q5CNdSOtCwoaHFNOqQa6n2R7iejlrAawi1bQEFkLYw8bNOEPioiUJFutUjLgoJ22wVmrKw2snbPTz4amuiIoPgtK/6Dsx9gvtKnpflQKOFn5Ohb1jxUhjGI18N8ZgYvfGM6KKhC3fh6DYI9SpIkSZIkSZIQvw2aWB7XSBXQAAAAAElFTkSuQmCC" preserveAspectRatio="xMidYMid meet" />
        </g>
      </g>
    </g>
  </svg>
);

// Icon for "No" (Double Eyelid - with a visible crease)
const DoubleEyelidIcon = ({ selected }: { selected: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 36 36.000001"
    preserveAspectRatio="xMidYMid meet"
    version="1.0"
    className={`w-12 h-12 mr-4 flex-shrink-0 transition-all duration-300 ${selected ? 'brightness-0 invert' : ''}`}
  >
    <defs>
      <filter x="0%" y="0%" width="100%" height="100%" id="fbedf23171">
        <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" colorInterpolationFilters="sRGB" />
      </filter>
      <filter x="0%" y="0%" width="100%" height="100%" id="87203592b6">
        <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.2126 0.7152 0.0722 0 0" colorInterpolationFilters="sRGB" />
      </filter>
      <clipPath id="177b5b91ac">
        <path d="M 0.488281 0 L 35.511719 0 L 35.511719 35 L 0.488281 35 Z M 0.488281 0 " clipRule="nonzero" />
      </clipPath>
      <mask id="7d8a758d58">
        <g filter="url(#fbedf23171)">
          <g filter="url(#87203592b6)" transform="matrix(0.72973, 0, 0, 0.72973, 0.486486, 0.00000194595)">
            <image x="0" y="0" width="48" height="48" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAAAAAByaaZbAAAAAmJLR0QA/4ePzL8AAACaSURBVEiJ7c6xDcIwEIXh3zoSd1CDIlFEoskYmQBRZ4LIM8AEeJQoFdmAS5Ud2AFRUEBBaxR3SMhfeff07iBJkt/Lsi8LE5gt9oftA3vrumdUeX09lohQnsY6Jt8Oa6xXPVs2Qzufb/ocvDM4D3nfzOWLaQmigFGB1VTEfCVqAJXgLjR8VbvRuPslpvzDelVv4/OABE8nSfJ33hlzHdufMbY7AAAAAElFTkSuQmCC" preserveAspectRatio="xMidYMid meet" />
          </g>
        </g>
      </mask>
    </defs>
    <g clipPath="url(#177b5b91ac)">
      <g mask="url(#7d8a758d58)">
        <g transform="matrix(0.72973, 0, 0, 0.72973, 0.486486, 0.00000194595)">
          <image x="0" y="0" width="48" height="48" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAAABmJLR0QA/wD/AP+gvaeTAAAAHUlEQVRYhe3BAQEAAACCIP+vbkhAAQAAAAAAwK8BGzAAAf8KtqoAAAAASUVORK5CYII=" preserveAspectRatio="xMidYMid meet" />
        </g>
      </g>
    </g>
  </svg>
);


const MonolidQuizPage: React.FC<MonolidQuizPageProps> = ({ onBack, onContinue }) => {
  const { quizData, updateQuizData } = useQuiz();
  const [selectedOption, setSelectedOption] = useState<string | null>(quizData.monolid || null);

  const options = ['Sí', 'No'];

  const handleSelection = (option: string) => {
    setSelectedOption(option);
    updateQuizData({ monolid: option });
  };

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

        <ProgressBar currentStep={6} totalSteps={8} activeSection={1} />

        {/* Main Content */}
        <div className="text-left">
          <h1 className="text-4xl font-playfair font-bold mb-8">
            ¿Tienes ojos con párpado monolido?
          </h1>

          {/* Options */}
          <div className="space-y-4">
            {options.map((option) => {
              const isSelected = selectedOption === option;
              return (
                <button
                  key={option}
                  className={`w-full flex items-center text-left p-4 border rounded-xl text-lg font-sen transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-principal ${
                    isSelected
                      ? 'bg-principal text-complementar border-principal scale-105 shadow-md'
                      : 'bg-complementar border-secundaria text-apoio hover:border-principal'
                  }`}
                  onClick={() => handleSelection(option)}
                >
                  {option === 'Sí' 
                    ? <MonolidIcon selected={isSelected} /> 
                    : <DoubleEyelidIcon selected={isSelected} />
                  }
                  {option}
                </button>
              );
            })}
          </div>

          {/* Helper Text */}
          <div className="mt-6 text-sm text-gray-600 relative min-h-[8rem]">
              <div className={`absolute top-0 left-0 transition-opacity duration-300 ease-in-out ${selectedOption === 'Sí' ? 'opacity-100' : 'opacity-0'}`}>
                  <p>
                      <strong>Sí, considero que tengo:</strong> Superficie del párpado plana, sin pliegues visibles, comúnmente encontrada en personas de ascendencia asiática.
                  </p>
              </div>
              <div className={`absolute top-0 left-0 transition-opacity duration-300 ease-in-out ${selectedOption === 'No' ? 'opacity-100' : 'opacity-0'}`}>
                  <p>
                      <strong>No, considero que tengo:</strong> Pliegue definido en el párpado que crea un doblez sobre la línea de las pestañas.
                  </p>
              </div>
          </div>
        </div>
      </div>
      
      {/* Floating Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-complementar p-4 border-t border-secundaria">
         <div className="max-w-sm mx-auto">
            <button 
              onClick={onContinue}
              disabled={!selectedOption}
              className="w-full bg-apoio text-complementar py-4 px-6 rounded-xl text-lg font-sen font-bold shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-complementar focus:ring-apoio disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed enabled:hover:bg-opacity-90 enabled:hover:scale-105">
              CONTINUAR
            </button>
        </div>
      </div>
    </div>
  );
};

export default MonolidQuizPage;