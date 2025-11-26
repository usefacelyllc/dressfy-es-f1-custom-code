
import React from 'react';

interface FinalResultsPageProps {
  onContinue: () => void;
}

const CheckIcon: React.FC = () => (
    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
);

// New ReviewCard component based on the requested HTML/CSS structure
const ReviewCard: React.FC<{ 
    initials: string; 
    name: string; 
    date: string; 
    location: string; 
    age: number; 
    children: React.ReactNode 
}> = ({ initials, name, date, location, age, children }) => (
    <div className="bg-white border border-[#e0e0e0] rounded-lg p-5 mb-4 shadow-[0_2px_4px_rgba(0,0,0,0.05)] text-left font-sans">
        <div className="flex justify-between items-center mb-2.5">
            <div className="text-black text-lg tracking-[2px]">★★★★★</div>
            <div className="text-xs text-[#999] uppercase">{date}</div>
        </div>
        <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-[#ddd] rounded-full flex items-center justify-center font-bold text-[#555] mr-3 text-sm flex-shrink-0">
                {initials}
            </div>
            <div className="font-bold text-base text-[#333] font-sans">
                {name}
            </div>
        </div>
        <div className="text-[15px] leading-relaxed text-[#444] mb-4 font-sans">
            {children}
        </div>
        <div className="border-t border-[#eee] pt-2.5 text-[13px] text-[#666] flex flex-wrap gap-4 font-sans">
            <div className="flex items-center">{location}</div>
            <div className="flex items-center">Edad: {age}</div>
        </div>
    </div>
);

const FinalResultsPage: React.FC<FinalResultsPageProps> = ({ onContinue }) => {
  const benefits = [
    "Aparentar décadas más joven",
    "Lucir confiada/o y fresca/o",
    "Tener compras sin estrés",
    "Dejar de ser invisible",
    "Gastar menos para obtener más",
    "Dejar el juicio atrás",
  ];

  return (
    <div className="bg-complementar text-apoio font-sen">
      <div className="max-w-2xl mx-auto py-8 px-4 text-center">
        <header className="mb-10">
          <img 
            src="/assets/logo-dressfy.webp" 
            alt="Dressfy Logo"
            className="h-6 mx-auto"
          />
        </header>

        <section className="mb-12">
            <h1 className="font-playfair text-4xl font-bold mb-4">¿Por qué Dressfy?</h1>
            <p className="text-gray-700 mb-4">
                Adquirir un plan de <strong>Dressfy</strong> es más que solo mejorar tu apariencia: se trata de invertir en confianza y en ti misma. Obtendrás acceso a un análisis de belleza personalizado, recomendaciones de productos de expertos y un plan diario adaptado a ti. Cada día será una <strong>nueva oportunidad para brillar</strong>.
            </p>
            <p className="text-gray-700 mb-6">
                ¡No pierdas tiempo con pruebas y errores! ¡Conviértete en la <strong>mejor versión de ti mismo</strong>!
            </p>
            <button
                onClick={onContinue}
                className="w-full max-w-sm mx-auto bg-apoio text-complementar py-4 px-6 rounded-xl text-lg font-sen font-bold shadow-md transition-all duration-300 ease-in-out hover:bg-opacity-90 hover:scale-105"
            >
                Comienza ahora
            </button>
        </section>

        <section className="mb-12">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-6">
                "Personas como tú lograron grandes resultados usando Dressfy"
            </h2>
            <div className="bg-white rounded-2xl shadow-lg p-2">
                <img 
                    src="/assets/img-paywall-personas.webp" 
                    alt="Resultados de clientes de Dressfy"
                    className="rounded-xl w-full"
                />
            </div>
        </section>

        <section className="mb-12 text-left">
            <h2 className="font-playfair text-3xl font-bold mb-6 text-center">Con Dressfy lograrás:</h2>
            <div className="space-y-4">
                {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center">
                        <CheckIcon />
                        <span className="text-lg">{benefit}</span>
                    </div>
                ))}
            </div>
            <button
                onClick={onContinue}
                className="w-full max-w-sm mx-auto bg-apoio text-complementar py-4 px-6 rounded-xl text-lg font-sen font-bold shadow-md transition-all duration-300 ease-in-out hover:bg-opacity-90 hover:scale-105 mt-8"
            >
                Comienza ahora
            </button>
        </section>

        {/* Reviews Custom Section Implementation */}
        <section className="text-left bg-[#f8f9fa] p-5 rounded-xl -mx-4 sm:mx-0">
            <h2 className="font-playfair text-3xl font-bold mb-6 text-center text-black">A la Gente le Encanta Nuestro Plan</h2>
            
            <ReviewCard 
                initials="LM" 
                name="Lucía Martínez" 
                date="21 DE OCT, 2025" 
                location="Buenos Aires, Argentina" 
                age={52}
            >
                "¡Me hizo verme genial a pesar de la menopausia! Los cambios hormonales recientes me hicieron verme <span className="font-bold text-black">menos atractiva en el espejo. Con Dressfy</span>, encontré nuevos estilos de maquillaje que se ven bien independientemente de mi condición."
            </ReviewCard>

            <ReviewCard 
                initials="FL" 
                name="Fernanda López" 
                date="17 DE OCT, 2025" 
                location="Ciudad de México, México" 
                age={31}
            >
                "Me ayudó a elegir los productos correctos. Sentía que las compras de cosméticos no eran para mí: demasiados productos y marcas, pero nada me quedaba bien. <span className="font-bold text-black">¡Dressfy me ayudó a demostrar lo contrario!</span>"
            </ReviewCard>

            <ReviewCard 
                initials="JR" 
                name="Juliana Ruiz" 
                date="17 DE OCT, 2025" 
                location="Bogotá, Colombia" 
                age={47}
            >
                "¡Ahora ahorro tanto tiempo en las compras! Antes no encontraba los cosméticos y productos de cuidado de la piel adecuados en mi ciudad, pero ahora este problema es cosa del pasado."
            </ReviewCard>
        </section>

      </div>
    </div>
  );
};

export default FinalResultsPage;