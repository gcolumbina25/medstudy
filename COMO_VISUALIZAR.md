# 👀 Como Visualizar a Aplicação Localmente

## Passo 1: Configurar o Firebase (OBRIGATÓRIO)

A aplicação precisa estar conectada ao Firebase para funcionar. Siga estes passos:

### 1.1 Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"** ou **"Create a project"**
3. Dê um nome ao projeto (ex: "medicina-platform")
4. Siga as instruções (pode desabilitar Google Analytics se quiser)
5. Clique em **"Criar projeto"**

### 1.2 Habilitar Authentication

1. No menu lateral, clique em **"Authentication"**
2. Clique em **"Get started"** ou **"Começar"**
3. Vá na aba **"Sign-in method"** ou **"Métodos de login"**
4. Clique em **"Email/Password"**
5. Ative a opção e clique em **"Salvar"**

### 1.3 Criar Firestore Database

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Create database"** ou **"Criar banco de dados"**
3. Escolha **"Start in production mode"** (modo produção)
4. Escolha uma localização (ex: `us-central1` ou `southamerica-east1` para Brasil)
5. Clique em **"Enable"** ou **"Ativar"**

### 1.4 Obter Credenciais do Firebase

1. No menu lateral, clique no ícone de **engrenagem** ⚙️ ao lado de "Project Overview"
2. Clique em **"Project settings"** ou **"Configurações do projeto"**
3. Role até a seção **"Your apps"** ou **"Seus apps"**
4. Clique no ícone **Web** `</>`
5. Dê um nome ao app (ex: "Medicina Platform Web")
6. **NÃO** marque "Also set up Firebase Hosting" (vamos fazer depois)
7. Clique em **"Register app"** ou **"Registrar app"**
8. **COPIE** as credenciais que aparecem (firebaseConfig)

### 1.5 Configurar Arquivo .env

1. No projeto, copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Abra o arquivo `.env` e cole suas credenciais:
   ```env
   VITE_FIREBASE_API_KEY=sua_api_key_aqui
   VITE_FIREBASE_AUTH_DOMAIN=seu-projeto-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=seu-projeto-id
   VITE_FIREBASE_STORAGE_BUCKET=seu-projeto-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
   VITE_FIREBASE_APP_ID=seu_app_id
   ```

## Passo 2: Criar Primeiro Usuário Admin

### 2.1 Criar Usuário no Authentication

1. No Firebase Console, vá em **Authentication** > **Users**
2. Clique em **"Add user"** ou **"Adicionar usuário"**
3. Digite um e-mail (ex: `admin@teste.com`)
4. Digite uma senha (mínimo 6 caracteres)
5. Clique em **"Add user"** ou **"Adicionar usuário"**
6. **COPIE O UID** do usuário criado (aparece na lista de usuários)

### 2.2 Criar Documento no Firestore

1. No Firebase Console, vá em **Firestore Database**
2. Clique em **"Start collection"** ou **"Iniciar coleção"**
3. Coleção ID: `users`
4. Clique em **"Next"** ou **"Próximo"**
5. Document ID: **Cole o UID do usuário que você copiou**
6. Adicione os campos:
   - Campo: `email` | Tipo: `string` | Valor: `admin@teste.com` (ou o e-mail que você usou)
   - Campo: `isAdmin` | Tipo: `boolean` | Valor: `true`
   - Campo: `blocked` | Tipo: `boolean` | Valor: `false`
   - Campo: `createdAt` | Tipo: `timestamp` | Valor: **Deixe vazio ou preencha manualmente com data/hora atual** (veja nota abaixo)
7. Clique em **"Save"** ou **"Salvar"**

**Nota sobre `createdAt`:** O Firestore não tem opção "now" na interface. Você tem 3 opções:
- **Opção 1 (Recomendada):** Deixe o campo vazio por enquanto. Ele será preenchido automaticamente quando você fizer login pela primeira vez.
- **Opção 2:** Preencha manualmente com a data e hora de hoje (use os campos Data e Hora que aparecem).
- **Opção 3:** Não crie o campo `createdAt` agora. Ele será criado automaticamente quando necessário.

## Passo 3: Executar a Aplicação

### 3.1 Iniciar Servidor de Desenvolvimento

No terminal, execute:

```bash
cd medicina-platform
npm run dev
```

Você verá algo como:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 3.2 Acessar no Navegador

1. Abra seu navegador
2. Acesse: `http://localhost:5173`
3. Você verá a tela de login

### 3.3 Fazer Login

1. Use o e-mail e senha do usuário admin que você criou
2. Clique em **"Entrar"**
3. Você será redirecionado para o dashboard

## Passo 4: Testar Funcionalidades

### 4.1 Adicionar Conteúdo (Como Admin)

1. No menu superior, clique em **"Admin"**
2. Na aba **"Tópicos"**, clique em **"+ Novo Tópico"**
3. Preencha:
   - Nome: `Bioquímica`
   - Descrição: `Estudo das reações químicas`
   - URL da imagem: `https://images.unsplash.com/photo-1532619675605-1ede6c9ed2d7?w=800`
   - Ordem: `1`
4. Clique em **"Criar"**
5. Clique em **"Ver Aulas"** no tópico criado
6. Clique em **"+ Nova Aula"**
7. Preencha:
   - Título: `Introdução à Bioquímica`
   - Código iframe do vídeo: `<iframe src="https://drive.google.com/file/d/1AL4aXtByXIi_GFbbzrPX2lktuzU1jvlG/preview" width="640" height="480"></iframe>`
   - Código iframe do PDF: `<iframe src="https://drive.google.com/file/d/1AL4aXtByXIi_GFbbzrPX2lktuzU1jvlG/preview" width="640" height="480"></iframe>`
   - Ordem: `1`
8. Clique em **"Criar"**

### 4.2 Testar como Usuário

1. Volte para o dashboard (clique em **"Início"**)
2. Clique no card do tópico criado
3. Clique em uma aula
4. Teste:
   - Assistir ao vídeo
   - Ver o PDF
   - Mudar o status da aula
   - Fazer anotações (elas salvam automaticamente)

## ⚠️ Problemas Comuns

### Erro: "Firebase: Error (auth/configuration-not-found)"
- **Solução**: Verifique se o arquivo `.env` existe e está preenchido corretamente
- Reinicie o servidor após criar/editar o `.env`

### Erro: "Firebase: Error (auth/invalid-email)"
- **Solução**: Verifique se o e-mail está no formato correto (ex: `usuario@email.com`)

### Erro: "Permission denied" no Firestore
- **Solução**: Publique as regras de segurança:
  1. No Firebase Console, vá em **Firestore Database** > **Rules**
  2. Cole o conteúdo do arquivo `firestore.rules` do projeto
  3. Clique em **"Publish"** ou **"Publicar"**

### Página em branco ou erros no console
- **Solução**: 
  1. Abra o Console do navegador (F12)
  2. Verifique se há erros
  3. Confirme que todas as variáveis do `.env` estão preenchidas
  4. Reinicie o servidor: `Ctrl+C` e depois `npm run dev`

### Não consigo fazer login
- **Solução**: 
  1. Verifique se o usuário existe no Firebase Authentication
  2. Verifique se o documento no Firestore tem `isAdmin: true`
  3. Confirme que o UID do documento corresponde ao UID do usuário

## 🎯 Próximos Passos

Após visualizar e testar localmente:
1. Adicione mais conteúdo (tópicos e aulas)
2. Crie mais usuários via painel admin
3. Quando estiver satisfeito, faça o deploy (veja `README.md`)

## 💡 Dica

Para parar o servidor, pressione `Ctrl+C` no terminal.
