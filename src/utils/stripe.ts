import { loadStripe } from '@stripe/stripe-js';

// Chave pública fornecida.
const STRIPE_PUBLIC_KEY = 'pk_test_51STBv3QbNCMPOvRMDyWPoIEvtl4fRCbMfKwlglsoH2H1RGvhIpU7oubCuOCLbXDQalolqMDls0bE9B9id21NqC8I00eT8zfE7A'; 

export const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);