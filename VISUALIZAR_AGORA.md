# 🚀 Visualizar Aplicação - Resumo Rápido

## ⚡ Passos Rápidos (5 minutos)

### 1️⃣ Configurar Firebase (3 min)

1. Acesse: https://console.firebase.google.com/
2. Crie um projeto novo
3. Ative **Authentication** > **Email/Password**
4. Crie **Firestore Database** (modo produção)
5. Vá em **⚙️ Project Settings** > **Your apps** > **Web** `</>`
6. Copie as credenciais (firebaseConfig)

### 2️⃣ Preencher .env (1 min)

O arquivo `.env` já foi criado! Abra e cole suas credenciais:

```env
VITE_FIREBASE_API_KEY=cole_aqui
VITE_FIREBASE_AUTH_DOMAIN=cole_aqui
VITE_FIREBASE_PROJECT_ID=cole_aqui
VITE_FIREBASE_STORAGE_BUCKET=cole_aqui
VITE_FIREBASE_MESSAGING_SENDER_ID=cole_aqui
VITE_FIREBASE_APP_ID=cole_aqui
```

### 3️⃣ Criar Usuário Admin (1 min)

**No Firebase Console:**

1. **Authentication** > **Users** > **Add user**
   - Email: `admin@teste.com`
   - Senha: `123456` (ou outra)
   - **COPIE O UID**

2. **Firestore Database** > **Start collection**
   - Coleção: `users`
   - Document ID: **Cole o UID**
   - Campos:
     - `email` (string): `admin@teste.com`
     - `isAdmin` (boolean): `true`
     - `blocked` (boolean): `false`
     - `createdAt` (timestamp): **Deixe vazio** (será preenchido automaticamente)

### 4️⃣ Executar (30 seg)

```bash
npm run dev
```

Acesse: **http://localhost:5173**

Login: `admin@teste.com` / `123456`

---

## 📋 Comandos Úteis

```bash
# Iniciar servidor
npm run dev

# Parar servidor
Ctrl + C

# Ver erros
# Abra o Console do navegador (F12)
```

## ❓ Precisa de ajuda detalhada?

Veja o arquivo **`COMO_VISUALIZAR.md`** para instruções completas!
