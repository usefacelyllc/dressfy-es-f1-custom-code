import React, { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { stripePromise } from '../utils/stripe';

interface StripeWrapperProps {
  children: ReactNode;
  clientSecret?: string;
}

const StripeWrapper: React.FC<StripeWrapperProps> = ({ children, clientSecret }) => {
  // Configuração visual alinhada com o tema do Makefy
  const appearance: StripeElementsOptions['appearance'] = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#000000', // Cor de apoio/principal
      colorBackground: '#ffffff',
      colorText: '#000000',
      fontFamily: '"Sen", sans-serif',
      borderRadius: '12px',
    },
    rules: {
      '.Input': {
        border: '1px solid #E5E7EB', // border-secundaria
        boxShadow: 'none',
      },
      '.Input:focus': {
        border: '1px solid #000000', // focus ring style
        boxShadow: 'none',
      }
    }
  };

  // Se tivermos o clientSecret, renderizamos o contexto real do Stripe
  if (clientSecret) {
    const options: StripeElementsOptions = {
      clientSecret,
      appearance,
    };

    return (
      <Elements stripe={stripePromise} options={options}>
        {children}
      </Elements>
    );
  }

  // Modo de simulação/carregamento visual quando não há clientSecret
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-200 border-dashed">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apoio mb-4"></div>
      <p className="text-gray-500 font-sen text-sm">Iniciando pagamento seguro...</p>
    </div>
  );
};

export default StripeWrapper;