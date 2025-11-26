# Guia de Configuração do Apple Pay no Recurly

## ⚠️ Problema Atual

O erro `"apple_pay feature is not enabled for this site"` indica que o Apple Pay ainda não foi habilitado no painel administrativo do Recurly.

## 📋 Passos para Habilitar o Apple Pay

### **PASSO 1: Contatar o Recurly Support**

**IMPORTANTE**: Você precisa contatar o suporte do Recurly para habilitar o recurso.

1. Entre em contato com o **Recurly Support**
2. Solicite para **habilitar o "Feature Flag Apple Pay Web Payments"** para seu site
3. Após a habilitação, uma nova opção **"Apple Pay"** aparecerá nas **Gateway Settings**

> **Nota**: Sem este passo, você não poderá continuar com a configuração.

### **PASSO 2: Gerar Merchant ID e Payment Processing Keys**

O Recurly Support fornecerá as chaves necessárias após habilitar o feature flag.

### **PASSO 3: Gerar Certificate Signing Requests (CSRs)**

O Recurly Support gerará os CSRs necessários para criar os certificados. Este processo pode levar alguns dias úteis.

Você receberá dois arquivos CSR:
- `payment.csr` - Para o Apple Pay Certificate
- `merchant_id.csr` - Para o Merchant Identity Certificate

> **IMPORTANTE**: Você DEVE usar os CSRs fornecidos pelo Recurly para garantir que a integração funcione corretamente.

---

## 🍎 Configuração no Apple Developer Portal

Após receber as **chaves** e **CSRs** do Recurly Support:

### 1. Acesse o Apple Developer Portal
- Faça login em [developer.apple.com](https://developer.apple.com)

### 2. Crie o "Apple Pay Certificate"
1. Vá para **Certificates, Identifiers & Profiles**
2. Selecione **Certificates**
3. Clique em **+** para criar um novo certificado
4. Selecione **"Apple Pay Certificate"**
5. Escolha o **Merchant ID** correto
6. Faça upload do arquivo `payment.csr` fornecido pelo Recurly

### 3. Crie o "Merchant Identity Certificate"
1. Repita o processo acima
2. Desta vez, selecione **"Merchant Identity Certificate"**
3. Faça upload do arquivo `merchant_id.csr` fornecido pelo Recurly

### 4. Baixe os Certificados
- Baixe o **Apple Pay Certificate** (Payment Processing Certificate)
- Baixe o **Merchant Identity Certificate** (Merchant ID Certificate)

---

## ⚙️ Configuração Final no Recurly

### 1. Acesse a Página de Configuração
- No painel do Recurly, vá para **Configuration → Apple Pay**
- Ou clique no botão **"Get Started"** na página do Apple Pay

### 2. Preencha os Dados

#### Domínio Verificado
- **Formato**: `www.DOMAIN.com` ou `DOMAIN.com`
- ⚠️ **IMPORTANTE**: Use seu domínio real (ex: `www.dressfy.app` ou `quizz.dressfy.app`)
- ❌ **NÃO** use o domínio que aparece no campo `cert_UID` (este é um erro comum!)

#### Nome da Loja
- Digite o nome que aparecerá para os clientes durante o checkout
- Exemplo: "Dressfy"

#### Link para Atualizar Informações de Cobrança
- Forneça um link onde os clientes possam atualizar informações de cobrança
- Exemplo: `https://www.dressfy.app/login`
- Se você usar **Hosted Pages Account Login**, o Recurly pode determinar isso automaticamente

### 3. Faça Upload dos Arquivos

Na página de configuração do Apple Pay, você precisará fazer upload de **4 arquivos**:

| Campo no Recurly | Arquivo a Fazer Upload |
|------------------|------------------------|
| **Payment Processing Key** | Payment Processing Private Key (fornecido pelo Recurly) |
| **Merchant ID Key** | Merchant ID Private Key (fornecido pelo Recurly) |
| **Merchant Identity Certificate** | Merchant ID Certificate (baixado do Apple Developer) |
| **Apple Pay Certificate** | Payment Processing Certificate (baixado do Apple Developer) |

### 4. Salve e Finalize

Após fazer upload de todos os arquivos e preencher os dados:
1. Revise todas as informações
2. Clique em **Salvar** ou **Finalizar**
3. Aguarde a confirmação de que a configuração foi concluída

---

## ✅ Verificação

Após completar todos os passos:

1. O erro `"apple_pay feature is not enabled"` deve desaparecer
2. O botão do Apple Pay deve aparecer corretamente no checkout
3. Você poderá processar pagamentos via Apple Pay

---

## 🔄 Para Sites em Sandbox

⚠️ **IMPORTANTE**: Se seu site está em **modo sandbox**:
- Ao mudar para **produção**, a conexão entre Recurly e Apple Pay será **terminada**
- Você precisará **re-estabelecer** essa conexão após mudar para produção

---

## 📞 Suporte

Se tiver dúvidas ou problemas:

1. **Recurly Support**: Entre em contato através do painel do Recurly
2. **Documentação**: [Apple Pay on the Web - Recurly Docs](https://docs.recurly.com/recurly-subscriptions/docs/apple-pay-on-the-web)
3. **Documentação do Recurly.js**: Consulte a documentação do Recurly.js v4

---

## 🎯 Resumo Rápido

1. ✅ Contatar Recurly Support → Habilitar Feature Flag
2. ✅ Receber chaves e CSRs do Recurly Support
3. ✅ Criar certificados no Apple Developer Portal
4. ✅ Configurar no Recurly (Configuration → Apple Pay)
5. ✅ Fazer upload de todos os arquivos
6. ✅ Testar no checkout

---

## 📝 Notas Importantes

- O processo pode levar **vários dias úteis** devido à geração dos CSRs
- Você **deve** usar os CSRs fornecidos pelo Recurly (não criar seus próprios)
- O domínio deve estar **verificado** no Apple Developer Portal
- Certifique-se de usar o **domínio correto** (não o cert_UID)

