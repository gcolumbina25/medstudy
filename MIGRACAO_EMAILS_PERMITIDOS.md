# Migração para Sistema de E-mails Permitidos

## Visão Geral

O sistema foi alterado para usar apenas login via Google, onde o administrador adiciona e-mails permitidos manualmente. Quando um usuário faz login com Google, se o e-mail estiver na lista, o sistema cria automaticamente o documento do usuário no Firestore.

## Passos para Migração

### 1. Implantar as Novas Regras do Firestore

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Vá para **Firestore Database > Rules**
3. Substitua as regras pelas regras atualizadas no arquivo `firestore.rules`
4. Clique em **"Publish"**

### 2. Migrar Usuários Existentes

Execute o seguinte código no console do navegador (como administrador logado) para migrar usuários existentes:

```javascript
// Função para migrar usuários existentes
async function migrateExistingUsers() {
  const db = firebase.firestore();
  
  try {
    // Buscar todos os usuários existentes
    const usersSnapshot = await db.collection('users').get();
    const allowedEmailsRef = db.collection('allowedEmails');
    
    console.log(`Migrando ${usersSnapshot.size} usuários...`);
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      // Verificar se o e-mail já existe na lista de permitidos
      const existingEmail = await allowedEmailsRef.where('email', '==', userData.email).get();
      
      if (existingEmail.empty) {
        // Adicionar à lista de permitidos
        await allowedEmailsRef.add({
          email: userData.email,
          isAdmin: userData.isAdmin || false,
          addedBy: 'migration_script',
          addedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log(`✅ Migrado: ${userData.email}`);
      } else {
        console.log(`⚠️ Já existe: ${userData.email}`);
      }
    }
    
    console.log('Migração concluída!');
  } catch (error) {
    console.error('Erro na migração:', error);
  }
}

// Executar migração
migrateExistingUsers();
```

### 3. Testar o Sistema

1. Como administrador, acesse a aba **"E-mails Permitidos"** no painel admin
2. Adicione um novo e-mail de teste
3. Tente fazer login com esse e-mail no Google
4. Verifique se o usuário foi criado automaticamente

### 4. Remover Funcionalidades Antigas (Opcional)

Após confirmar que tudo funciona, você pode remover ou desabilitar a aba "Usuários" antiga, pois agora os usuários são criados automaticamente.

## Estrutura das Coleções

### allowedEmails
- `email`: string (obrigatório)
- `isAdmin`: boolean
- `addedBy`: string (UID do admin que adicionou)
- `addedAt`: timestamp

### users (mantida, mas criada automaticamente)
- `email`: string
- `isAdmin`: boolean
- `blocked`: boolean
- `createdAt`: timestamp
- `lastLogin`: timestamp

## Segurança

- Apenas administradores podem gerenciar a lista de e-mails permitidos
- Usuários não listados recebem erro de "não cadastrado"
- O sistema cria automaticamente o documento do usuário no primeiro login</content>
<parameter name="filePath">/workspaces/version-1.0/MIGRACAO_EMAILS_PERMITIDOS.md