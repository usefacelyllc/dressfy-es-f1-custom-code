# Configuração Stripe para Localhost

## 📋 Pré-requisitos

1. **Node.js** instalado (versão 18 ou superior)
2. **Conta Stripe** com chaves de teste
3. **Vercel CLI** para rodar as API routes localmente

## 🚀 Passos para Configurar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Instalar Vercel CLI (se ainda não tiver)

```bash
npm install -g vercel
```

### 3. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.local.example` para `.env.local`:
   ```bash
   copy .env.local.example .env.local
   ```

2. Abra o arquivo `.env.local` e adicione sua **chave secreta** da Stripe:
   ```
   STRIPE_SECRET_KEY=sk_test_SUA_CHAVE_SECRETA_AQUI
   ```

   **Como obter a chave secreta:**
   - Acesse: https://dashboard.stripe.com/test/apikeys
   - Copie a chave que começa com `sk_test_`
   - ⚠️ **NUNCA** compartilhe ou commite esta chave no Git!

### 4. Rodar o Servidor Local

#### Opção A: Usando Vercel CLI (Recomendado)

Em um terminal, rode:
```bash
npm run dev:api
```

Isso iniciará o servidor na porta **3000** (ou outra disponível) e você poderá acessar a API em:
```
http://localhost:3000/api/create-payment-intent
```

#### Opção B: Rodar Frontend e API Separadamente

**Terminal 1** - Frontend (Vite):
```bash
npm run dev
```

**Terminal 2** - API (Vercel):
```bash
npm run dev:api
```

## 🧪 Testar a API

Você pode testar a API usando curl ou Postman:

```bash
curl -X POST http://localhost:3000/api/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 2000, "currency": "usd"}'
```

**Resposta esperada:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

## 🔗 Integração com Frontend

No seu código frontend, configure a URL da API:

```typescript
const response = await fetch('http://localhost:3000/api/create-payment-intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 2000, // Valor em centavos (ex: 2000 = $20.00)
    currency: 'usd'
  })
});

const { clientSecret } = await response.json();
```

## ⚠️ Importante

- A chave pública (`pk_test_...`) pode ser usada no frontend
- A chave secreta (`sk_test_...`) **NUNCA** deve ser exposta no frontend
- Use sempre chaves de **teste** durante desenvolvimento
- Para produção, use chaves **live** e configure no Vercel Dashboard

## 🐛 Troubleshooting

### Erro: "STRIPE_SECRET_KEY is not defined"
- Verifique se o arquivo `.env.local` existe
- Confirme que a variável está definida corretamente
- Reinicie o servidor após criar/editar `.env.local`

### Erro: "Cannot find module '@vercel/node'"
- Execute: `npm install`

### Porta já em uso
- O Vercel CLI tentará usar outra porta automaticamente
- Verifique no terminal qual porta está sendo usada

