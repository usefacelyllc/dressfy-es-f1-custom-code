# 🚀 Guia Rápido - Rodar Stripe no Localhost

## ✅ Status da Configuração

- ✅ Vercel CLI instalado (v48.10.6)
- ✅ Dependências instaladas
- ✅ Chave secreta configurada no `.env.local`
- ✅ Chave pública já configurada no código (`src/utils/stripe.ts`)

## 🎯 Como Rodar

### Opção 1: Rodar apenas a API (Recomendado para testes)

```bash
npm run dev:api
```

Isso iniciará o servidor na porta **3000** (ou outra disponível). A API estará disponível em:
```
http://localhost:3000/api/create-payment-intent
```

### Opção 2: Rodar Frontend + API (Para desenvolvimento completo)

**Terminal 1** - Frontend:
```bash
npm run dev
```

**Terminal 2** - API:
```bash
npm run dev:api
```

## 🧪 Testar a API

Você pode testar usando PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/create-payment-intent" -Method POST -ContentType "application/json" -Body '{"amount": 2000, "currency": "usd"}'
```

Ou usando curl (se tiver instalado):
```bash
curl -X POST http://localhost:3000/api/create-payment-intent -H "Content-Type: application/json" -d "{\"amount\": 2000, \"currency\": \"usd\"}"
```

**Resposta esperada:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

## 📝 Notas Importantes

1. **Chave Pública**: Já está configurada no código (`pk_test_51STBv3QbNCMPOvRMDyWPoIEvtl4fRCbMfKwlglsoH2H1RGvhIpU7oubCuOCLbXDQalolqMDls0bE9B9id21NqC8I00eT8zfE7A`)

2. **Chave Secreta**: Está no arquivo `.env.local` (não commite este arquivo!)

3. **Frontend**: O código já está configurado para chamar `/api/create-payment-intent` automaticamente

4. **CORS**: O código já está configurado para aceitar requisições de qualquer origem (modo desenvolvimento)

## 🐛 Problemas Comuns

- **Porta já em uso**: O Vercel CLI tentará usar outra porta automaticamente
- **Erro de chave**: Verifique se o arquivo `.env.local` existe e tem a chave secreta correta
- **API não responde**: Certifique-se de que o `vercel dev` está rodando

