# 🔧 Solução para Erro 500 na API

## Problema Identificado

A API está retornando erro 500, provavelmente porque:
1. O Vercel CLI não está lendo o arquivo `.env.local` corretamente
2. A chave secreta do Stripe não está sendo carregada

## ✅ Soluções Aplicadas

1. ✅ Criado arquivo `.env` (o Vercel CLI pode preferir este nome)
2. ✅ Adicionada validação na API para verificar se a chave está configurada
3. ✅ Melhorado tratamento de erros no frontend para mostrar mensagens claras

## 🚀 Próximos Passos

### 1. Reiniciar o Servidor Vercel

**IMPORTANTE**: Você precisa **parar e reiniciar** o servidor Vercel CLI para que ele leia as novas variáveis de ambiente:

1. Pare o servidor Vercel (Ctrl+C no terminal onde está rodando)
2. Inicie novamente:
   ```bash
   npm run dev:api
   ```

### 2. Verificar se Funcionou

Teste a API diretamente:
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/create-payment-intent" -Method POST -ContentType "application/json" -Body '{"amount": 1367, "currency": "usd"}'
```

**Se funcionar**, você verá:
```json
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

**Se ainda der erro**, verifique:
- Se o arquivo `.env` existe e tem a chave secreta
- Se o servidor foi reiniciado
- Os logs do terminal do Vercel CLI para ver o erro específico

### 3. Verificar Logs

No terminal onde o `vercel dev` está rodando, você deve ver:
- Se a chave está sendo lida: nenhum erro sobre "STRIPE_SECRET_KEY não está configurada"
- Se há erros do Stripe: aparecerão no console

## 📝 Arquivos Criados

- `.env` - Cópia do `.env.local` (para garantir que o Vercel CLI leia)
- Melhorias no tratamento de erros na API e no frontend

## ⚠️ Importante

**SEMPRE reinicie o servidor Vercel após modificar arquivos `.env` ou `.env.local`!**

