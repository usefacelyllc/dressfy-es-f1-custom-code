import type { VercelRequest, VercelResponse } from '@vercel/node';

import Stripe from 'stripe';

// Inicializa o Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // -----------------------------------------------------------------
  // CONFIGURAÇÃO DO CORS (Liberar acesso para o AI Studio)
  // -----------------------------------------------------------------
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); // '*' libera pra qualquer site (Perfeito para testes)
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Se for apenas o navegador perguntando "posso usar?", a gente diz SIM (200 OK)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // -----------------------------------------------------------------
  // LÓGICA DE PAGAMENTO
  // -----------------------------------------------------------------
  if (req.method === 'POST') {
    try {
      // Verifica se a chave secreta está configurada
      if (!process.env.STRIPE_SECRET_KEY) {
        console.error("STRIPE_SECRET_KEY não está configurada!");
        return res.status(500).json({ 
          error: 'Chave secreta do Stripe não configurada. Verifique o arquivo .env.local' 
        });
      }

      const { amount, currency } = req.body;

      // Validação simples
      if (!amount) {
        return res.status(400).json({ error: 'Valor (amount) é obrigatório' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency || 'usd',
        automatic_payment_methods: { enabled: true },
      });

      // Retorna o segredo para o frontend
      return res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Erro Stripe:", error);
      return res.status(500).json({ 
        error: error.message || 'Erro ao processar pagamento',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  // Qualquer outro método (GET, etc) não é permitido
  return res.status(405).json({ error: 'Method Not Allowed' });
}