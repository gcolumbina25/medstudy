# 🔧 Como Corrigir o Erro de API Key

## ❌ Erro: "auth/api-key-not-valid"

Este erro acontece porque o arquivo `.env` ainda está com valores de exemplo. Você precisa preencher com suas credenciais reais do Firebase.

## ✅ Solução Passo a Passo

### Passo 1: Obter Credenciais do Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto (ou crie um novo se ainda não tiver)
3. Clique no ícone de **⚙️ engrenagem** ao lado de "Project Overview"
4. Clique em **"Project settings"** ou **"Configurações do projeto"**
5. Role a página até a seção **"Your apps"** ou **"Seus apps"**
6. Se você já criou um app web, você verá algo como:
   ```
   Your apps
   [Web app icon] medicina-platform-web
   ```
7. Se **NÃO** tiver um app web ainda:
   - Clique no ícone **Web** `</>`
   - Dê um nome (ex: "medicina-platform")
   - **NÃO** marque "Also set up Firebase Hosting"
   - Clique em **"Register app"** ou **"Registrar app"**
8. Você verá um código JavaScript com `firebaseConfig`. **COPIE** os valores:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",  // ← COPIE ESTE
  authDomain: "seu-projeto.firebaseapp.com",      // ← COPIE ESTE
  projectId: "seu-projeto-id",                     // ← COPIE ESTE
  storageBucket: "seu-projeto-id.appspot.com",      // ← COPIE ESTE
  messagingSenderId: "123456789012",                // ← COPIE ESTE
  appId: "1:123456789012:web:abcdef123456"         // ← COPIE ESTE
};
```

### Passo 2: Preencher o Arquivo .env

1. Abra o arquivo `.env` no projeto (está na pasta raiz: `medicina-platform/.env`)
2. Substitua os valores de exemplo pelos valores reais que você copiou:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

**⚠️ IMPORTANTE:**
- **NÃO** coloque aspas (`"`) nos valores
- **NÃO** deixe espaços antes ou depois do `=`
- Copie exatamente como aparece no Firebase

### Passo 3: Reiniciar o Servidor

**MUITO IMPORTANTE:** Após editar o `.env`, você **DEVE** reiniciar o servidor!

1. No terminal onde o servidor está rodando, pressione `Ctrl + C` para parar
2. Execute novamente:
   ```bash
   npm run dev
   ```

### Passo 4: Testar Novamente

1. Acesse `http://localhost:5173`
2. Tente fazer login novamente
3. O erro deve ter desaparecido! ✅

## 🔍 Verificar se Está Correto

Para verificar se o `.env` está sendo carregado corretamente, você pode:

1. Abrir o Console do navegador (F12)
2. Ir na aba **Console**
3. Se aparecer algum erro sobre variáveis de ambiente, significa que algo está errado

## ⚠️ Problemas Comuns

### "Ainda aparece o erro"
- Verifique se você **reiniciou o servidor** após editar o `.env`
- Confirme que **não há aspas** nos valores
- Verifique se copiou os valores **corretos** do Firebase
- Certifique-se de que o arquivo se chama exatamente `.env` (não `.env.txt`)

### "Não encontro as credenciais no Firebase"
- Certifique-se de que criou um **app web** no Firebase
- Se não criou, siga o Passo 1 acima para criar

### "O arquivo .env não existe"
- Crie o arquivo na raiz do projeto: `medicina-platform/.env`
- Ou copie de `.env.example`: `cp .env.example .env`

## 📝 Exemplo de .env Correto

```env
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
VITE_FIREBASE_AUTH_DOMAIN=medicina-platform-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=medicina-platform-12345
VITE_FIREBASE_STORAGE_BUCKET=medicina-platform-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=987654321098
VITE_FIREBASE_APP_ID=1:987654321098:web:abcdef1234567890
```

## ✅ Checklist

- [ ] Criei um app web no Firebase
- [ ] Copiei todas as 6 credenciais corretamente
- [ ] Preenchi o arquivo `.env` sem aspas
- [ ] Reiniciei o servidor (`Ctrl+C` e depois `npm run dev`)
- [ ] Testei fazer login novamente

Se ainda tiver problemas após seguir todos os passos, me avise!
