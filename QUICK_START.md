# 🚀 Guia Rápido de Início

## Passo a Passo para Começar

### 1. Configurar Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Vá em **Authentication** > **Get Started** > Habilite **Email/Password**
4. Vá em **Firestore Database** > **Create database** > Modo produção
5. Copie as credenciais do projeto (Project Settings > General > Your apps)

### 2. Configurar Variáveis de Ambiente

1. Copie `.env.example` para `.env`
2. Cole suas credenciais do Firebase no arquivo `.env`

### 3. Criar Primeiro Usuário Admin

**Opção 1: Via Firebase Console (Recomendado)**
1. Firebase Console > Authentication > Users > Add user
2. Crie um usuário com e-mail e senha
3. Anote o UID do usuário criado
4. Vá em Firestore Database
5. Crie coleção `users`
6. Crie documento com ID = UID do usuário
7. Adicione campos:
   ```
   email: "seu@email.com" (string)
   isAdmin: true (boolean)
   blocked: false (boolean)
   createdAt: (timestamp - use "Add field" > timestamp)
   ```

**Opção 2: Via Código (Após primeiro login)**
- Faça login com uma conta criada manualmente no Firebase
- No console do navegador, execute:
```javascript
// Você precisará implementar uma função temporária ou usar o painel admin após criar o primeiro admin
```

### 4. Executar Localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` e faça login com o usuário admin criado.

### 5. Adicionar Conteúdo

1. Faça login como admin
2. Acesse o menu **Admin**
3. Crie tópicos e aulas
4. Para vídeos/PDFs do Google Drive:
   - Compartilhe o arquivo como "Qualquer pessoa com o link"
   - Copie o link
   - Use o formato: `<iframe src="https://drive.google.com/file/d/SEU_ID_AQUI/preview" width="640" height="480"></iframe>`
   - Para obter o ID: o link do Google Drive tem formato `https://drive.google.com/file/d/ID_DO_ARQUIVO/view`
   - Substitua `/view` por `/preview` no iframe

### 6. Deploy no Firebase Hosting

```bash
# Instalar Firebase CLI (se ainda não tiver)
npm install -g firebase-tools

# Login
firebase login

# Inicializar (apenas primeira vez)
firebase init hosting
# - Selecione seu projeto
# - Public directory: dist
# - Configure as single-page app: Yes
# - Não sobrescreva index.html: No

# Build e Deploy
npm run build
firebase deploy --only hosting
```

### 7. Configurar Regras de Segurança do Firestore

1. No Firebase Console, vá em **Firestore Database** > **Rules**
2. Cole o conteúdo do arquivo `firestore.rules`
3. Clique em **Publish**

## 📝 Estrutura de Dados Mínima

### Criar Tópico de Exemplo Manualmente

Coleção: `topics`
Documento ID: (gerado automaticamente)
```
name: "Bioquímica"
description: "Estudo das reações químicas"
imageUrl: "https://images.unsplash.com/photo-1532619675605-1ede6c9ed2d7?w=800"
order: 1
createdAt: (timestamp)
```

### Criar Aula de Exemplo

Coleção: `topics/{topicId}/lessons`
Documento ID: (gerado automaticamente)
```
title: "Introdução à Bioquímica"
videoEmbed: "<iframe src=\"https://drive.google.com/file/d/SEU_ID/preview\" width=\"640\" height=\"480\"></iframe>"
pdfEmbed: "<iframe src=\"https://drive.google.com/file/d/SEU_ID/preview\" width=\"640\" height=\"480\"></iframe>"
order: 1
createdAt: (timestamp)
```

## ⚠️ Problemas Comuns

### "Erro ao fazer login"
- Verifique se Email/Password está habilitado no Firebase
- Confirme que o usuário existe no Authentication

### "Acesso negado" no Admin
- Verifique se o campo `isAdmin: true` está no documento do usuário no Firestore
- Confirme que o UID do documento corresponde ao UID do usuário autenticado

### Vídeos/PDFs não aparecem
- Verifique se o arquivo está compartilhado publicamente no Google Drive
- Confirme que o iframe está no formato correto com `/preview`
- Teste o link do iframe diretamente no navegador

### "Permission denied" no Firestore
- Publique as regras de segurança do arquivo `firestore.rules`
- Verifique se o usuário está autenticado

## 🎯 Próximos Passos

1. Criar mais usuários via painel admin
2. Adicionar tópicos e aulas
3. Personalizar cores e imagens
4. Configurar domínio personalizado (opcional)
