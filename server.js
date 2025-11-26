import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Carrega variáveis de ambiente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });
dotenv.config({ path: join(__dirname, '.env.local') });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version']
}));
app.use(express.json());

// Inicializa o Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Rota da API
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    // Verifica se a chave secreta está configurada
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY não está configurada!");
      return res.status(500).json({ 
        error: 'Chave secreta do Stripe não configurada. Verifique o arquivo .env ou .env.local' 
      });
    }

    const { amount, currency } = req.body;

    // Validação
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
  } catch (error) {
    console.error("Erro Stripe:", error);
    return res.status(500).json({ 
      error: error.message || 'Erro ao processar pagamento'
    });
  }
});

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', port: PORT });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor API rodando em http://localhost:${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}/api/create-payment-intent`);
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('⚠️  AVISO: STRIPE_SECRET_KEY não encontrada!');
  } else {
    console.log('✅ STRIPE_SECRET_KEY configurada');
  }
});

