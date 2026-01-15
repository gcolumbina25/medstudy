# Medicina Platform - Ciclo Básico

Plataforma web privada de estudos para estudantes do curso de Medicina - Ciclo Básico, com interface estilo Netflix e foco em estudo ativo.

## 🚀 Funcionalidades

- ✅ Autenticação com Firebase Auth (login por e-mail e senha)
- ✅ Bloqueio de sessões simultâneas (apenas 1 sessão ativa por usuário)
- ✅ Organização de conteúdo em Tópicos e Aulas
- ✅ Vídeos e PDFs incorporados do Google Drive
- ✅ Sistema de status por aula (Não assistido, Preciso revisar, Conteúdo difícil, Dominei)
- ✅ Anotações privadas com auto-save
- ✅ Modo Revisão (filtra aulas que precisam de atenção)
- ✅ Barra de progresso por tópico
- ✅ Painel administrativo completo (CRUD de tópicos, aulas e usuários)
- ✅ Interface dark mode responsiva (mobile-first)
- ✅ Design moderno estilo Netflix com cores neon verde

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta Firebase com projeto criado
- Firebase Authentication habilitado (Email/Password)
- Firestore Database configurado

## 🛠️ Instalação

1. Clone ou baixe o projeto
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env`
   - Preencha com suas credenciais do Firebase:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

## 🔥 Configuração do Firebase

### 1. Criar Projeto no Firebase
- Acesse [Firebase Console](https://console.firebase.google.com/)
- Crie um novo projeto
- Anote as credenciais do projeto

### 2. Habilitar Authentication
- No Firebase Console, vá em **Authentication**
- Clique em **Get Started**
- Habilite **Email/Password** como método de login

### 3. Configurar Firestore
- No Firebase Console, vá em **Firestore Database**
- Clique em **Create database**
- Escolha modo de produção
- Escolha uma localização (ex: us-central1)

### 4. Criar Primeiro Usuário Admin
Após configurar o Firebase, você precisará criar o primeiro usuário administrador manualmente:

1. No Firebase Console, vá em **Authentication** > **Users**
2. Clique em **Add user**
3. Crie um usuário com e-mail e senha
4. No Firestore, crie uma coleção chamada `users`
5. Crie um documento com ID igual ao UID do usuário criado
6. Adicione os campos:
   - `email`: e-mail do usuário
   - `isAdmin`: `true`
   - `blocked`: `false`
   - `createdAt`: timestamp

## 🎮 Como Usar

### Desenvolvimento Local
```bash
npm run dev
```
Acesse `http://localhost:5173`

### Build para Produção
```bash
npm run build
```

### Deploy no Firebase Hosting

1. Instale o Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Faça login:
```bash
firebase login
```

3. Inicialize o projeto:
```bash
firebase init hosting
```
- Selecione o projeto Firebase
- Configure o diretório de build como `dist`
- Configure como SPA (Single Page Application)

4. Faça o deploy:
```bash
npm run build
firebase deploy --only hosting
```

## 📚 Estrutura de Dados no Firestore

### Coleção: `users`
```
users/{userId}
  - email: string
  - isAdmin: boolean
  - blocked: boolean
  - lastAccess: timestamp
  - createdAt: timestamp
```

### Coleção: `topics`
```
topics/{topicId}
  - name: string
  - description: string
  - imageUrl: string
  - order: number
  - createdAt: timestamp
```

### Subcoleção: `topics/{topicId}/lessons`
```
lessons/{lessonId}
  - title: string
  - videoEmbed: string (código iframe)
  - pdfEmbed: string (código iframe)
  - order: number
  - createdAt: timestamp
```

### Coleção: `userProgress`
```
userProgress/{userId}_{topicId}_{lessonId}
  - userId: string
  - topicId: string
  - lessonId: string
  - status: string ('nao-assistido' | 'preciso-revisar' | 'conteudo-dificil' | 'dominei')
  - updatedAt: timestamp
```

### Coleção: `userNotes`
```
userNotes/{userId}_{topicId}_{lessonId}
  - userId: string
  - topicId: string
  - lessonId: string
  - content: string
  - updatedAt: timestamp
```

## 🎨 Personalização

### Cores
As cores podem ser personalizadas no arquivo `src/index.css` através das variáveis CSS:
- `--accent-green`: Cor principal (verde neon)
- `--bg-primary`: Cor de fundo principal
- `--bg-secondary`: Cor de fundo secundária

### Fontes
As fontes são carregadas do Google Fonts. Você pode alterar no arquivo `src/index.css`.

## 🔒 Segurança

- Todas as rotas são protegidas (requerem autenticação)
- Apenas administradores podem acessar o painel admin
- Bloqueio de sessões simultâneas implementado
- Dados de usuário protegidos no Firestore

## 📝 Notas

- Os vídeos e PDFs devem ser compartilhados no Google Drive com permissão de visualização pública
- Use o formato de embed do Google Drive para os iframes
- O sistema não permite download de arquivos

## 🐛 Troubleshooting

### Erro de autenticação
- Verifique se o Email/Password está habilitado no Firebase
- Confirme que as credenciais no `.env` estão corretas

### Erro ao carregar dados
- Verifique as regras de segurança do Firestore
- Confirme que o usuário está autenticado

### Vídeos/PDFs não aparecem
- Verifique se os arquivos no Google Drive estão com permissão pública
- Confirme que o código iframe está correto

## 📄 Licença

Este projeto é privado e destinado apenas para uso educacional.

## 👨‍💻 Suporte

Para dúvidas ou problemas, entre em contato com o administrador da plataforma.
