# 🚀 Como Rodar o Projeto com Stripe

## ✅ Configuração Completa

- ✅ Chave secreta do Stripe configurada no `.env.local`
- ✅ Proxy configurado no Vite para redirecionar `/api/*` para o servidor Vercel
- ✅ Vite configurado para rodar na porta 3000 (frontend)
- ✅ Vercel CLI configurado para rodar na porta 3001 (API)

## 🎯 Como Rodar (2 Terminais)

### Terminal 1 - Frontend (Vite)
```bash
npm run dev
```
Isso iniciará o frontend em: `http://localhost:3000`

### Terminal 2 - API (Vercel)
```bash
npm run dev:api
```
Isso iniciará a API em: `http://localhost:3001`

O Vite está configurado para fazer proxy automático de `/api/*` para `http://localhost:3001`

## 🧪 Testar

1. Abra o navegador em `http://localhost:3000`
2. Navegue até a página de checkout
3. O pagamento deve iniciar automaticamente

## 🔍 Verificar se está funcionando

Abra o Console do Navegador (F12) e verifique:
- Se não houver erros de CORS
- Se a requisição para `/api/create-payment-intent` está sendo feita
- Se está retornando um `clientSecret`

## 🐛 Problemas Comuns

### "Iniciando pagamento seguro..." não para
- Verifique se o Terminal 2 (API) está rodando
- Verifique se a porta 3001 está livre
- Abra o Console do Navegador (F12) e veja se há erros

### Erro de CORS
- O código já está configurado para aceitar CORS de qualquer origem
- Se persistir, verifique se ambos os servidores estão rodando

### API não responde
- Verifique se o arquivo `.env.local` tem a chave secreta do Stripe
- Verifique se o Vercel CLI está rodando na porta 3001
- Teste a API diretamente: `http://localhost:3001/api/create-payment-intent`

