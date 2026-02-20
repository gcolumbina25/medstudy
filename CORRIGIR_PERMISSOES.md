# 🔒 Como Corrigir "Missing or insufficient permissions"

## ❌ Erro: "Missing or insufficient permissions"

Este erro acontece porque as **regras de segurança do Firestore** não estão configuradas ou não foram publicadas.

## ✅ Solução Passo a Passo

### Passo 1: Acessar as Regras do Firestore

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. No menu lateral, clique em **"Firestore Database"**
4. Clique na aba **"Rules"** ou **"Regras"** (no topo da página)

### Passo 2: Copiar as Regras

Você verá uma área de código. **Substitua tudo** que estiver lá pelo código abaixo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para usuários
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      (request.auth.uid == userId || 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
    
    // Regras para tópicos
    match /topics/{topicId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      
      // Regras para aulas dentro de tópicos
      match /lessons/{lessonId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null && 
                        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      }
    }
    
    // Regras para progresso do usuário
    match /userProgress/{progressId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && 
                       resource.data.userId == request.auth.uid &&
                       request.resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
    }
    
    // Regras para anotações do usuário
    match /userNotes/{noteId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && 
                       resource.data.userId == request.auth.uid &&
                       request.resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
    }
    
    // Regras para conteúdo da comunidade
    match /community_content/{contentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.uid == resource.data.author.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                       request.auth.uid == resource.data.author.uid;
      allow delete: if request.auth != null && 
                       request.auth.uid == resource.data.author.uid;
    }
    
    // Regras para e-mails permitidos
    // Qualquer usuário autenticado pode ler (para verificar se pode fazer login)
    // Apenas admins podem escrever/criar/excluir
    match /allowedEmails/{emailId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      allow create: if request.auth != null && 
                        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      allow delete: if request.auth != null && 
                        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

### Passo 3: Publicar as Regras

1. Após colar o código, clique no botão **"Publish"** ou **"Publicar"** (no topo direito)
2. Aguarde a confirmação de que as regras foram publicadas
3. Você verá uma mensagem de sucesso

### Passo 4: Verificar

1. Volte para a aplicação (`http://localhost:5173`)
2. Faça login novamente
3. O erro deve ter desaparecido! ✅

## 🔍 O que essas regras fazem?

- **Usuários autenticados** podem ler tópicos e aulas
- **Apenas admins** podem criar/editar/excluir tópicos e aulas
- **Cada usuário** pode gerenciar apenas seu próprio progresso e anotações
- **Usuários não autenticados** não têm acesso a nada

## ⚠️ Problemas Comuns

### "Erro ao publicar as regras"
- Verifique se copiou o código **completo**
- Certifique-se de que não há erros de sintaxe
- Tente novamente

### "Ainda aparece o erro após publicar"
- Aguarde alguns segundos (as regras podem levar alguns segundos para atualizar)
- Faça **logout e login novamente** na aplicação
- Limpe o cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R)

### "Não encontro a aba Rules"
- Certifique-se de que está em **Firestore Database** (não Realtime Database)
- A aba "Rules" fica no **topo da página**, ao lado de "Data" e "Indexes"

## 📝 Regras Temporárias (Apenas para Teste)

Se você quiser testar rapidamente sem configurar tudo, pode usar regras temporárias **menos seguras** (apenas para desenvolvimento):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **ATENÇÃO:** Essas regras permitem que qualquer usuário autenticado faça qualquer coisa. Use apenas para testes e depois substitua pelas regras corretas acima.

## ✅ Checklist

- [ ] Acessei Firestore Database > Rules
- [ ] Colei as regras corretas
- [ ] Cliquei em "Publish"
- [ ] Aguardei a confirmação
- [ ] Fiz logout e login novamente na aplicação
- [ ] Testei novamente

Se ainda tiver problemas, me avise!
