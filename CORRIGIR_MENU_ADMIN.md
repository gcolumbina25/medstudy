# 🔧 Corrigir Menu Admin - Passo a Passo

## ❌ Problema: Menu "Admin" não aparece

O menu Admin só aparece se o documento do usuário no Firestore tiver `isAdmin: true`.

## ✅ Solução Rápida

### Passo 1: Encontrar o UID do Usuário

**Opção A - No Firebase Console:**
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Vá em **Authentication** > **Users**
3. Encontre seu usuário na lista
4. **COPIE o UID** (código longo que aparece)

**Opção B - No Console do Navegador:**
1. Na aplicação, abra o Console (F12)
2. Vá na aba **Console**
3. Digite: `firebase.auth().currentUser?.uid`
4. Pressione Enter
5. **COPIE o UID** que aparecer

### Passo 2: Verificar/Criar Documento no Firestore

1. No Firebase Console, vá em **Firestore Database**
2. Verifique se existe a coleção `users`
3. Verifique se existe um documento com o **UID** que você copiou

### Passo 3: Criar ou Editar o Documento

#### Se o documento NÃO existe:

1. Clique em **"Start collection"** ou **"Iniciar coleção"**
2. **Collection ID:** `users`
3. Clique em **"Next"**
4. **Document ID:** Cole o **UID** que você copiou (muito importante!)
5. Adicione os campos:
   - Clique em **"Add field"**
   - Campo 1:
     - Field: `email`
     - Type: `string`
     - Value: seu e-mail (ex: `admin@teste.com`)
   - Campo 2:
     - Field: `isAdmin`
     - Type: `boolean`
     - Value: **`true`** ⚠️ MUITO IMPORTANTE!
   - Campo 3:
     - Field: `blocked`
     - Type: `boolean`
     - Value: `false`
6. Clique em **"Save"**

#### Se o documento JÁ existe:

1. Clique no documento do usuário (com o UID)
2. Verifique se existe o campo `isAdmin`
3. Se **NÃO existir**:
   - Clique em **"Add field"**
   - Field: `isAdmin`
   - Type: `boolean`
   - Value: **`true`**
   - Clique em **"Done"**
4. Se **JÁ existir** mas está como `false`:
   - Clique no campo `isAdmin`
   - Mude o valor para **`true`** (verdadeiro)
   - Clique em **"Save"**

### Passo 4: Recarregar a Aplicação

1. Volte para a aplicação (`http://localhost:5173`)
2. **Faça logout** (clique em "Sair" no menu)
3. **Faça login novamente**
4. O menu **"Admin"** deve aparecer! ✅

## 🔍 Verificar se Está Funcionando

Após fazer logout e login:

1. Verifique se o menu "Admin" aparece entre "Revisão" e seu e-mail
2. Se aparecer, clique nele para acessar o painel admin
3. Se não aparecer, verifique novamente o Passo 3

## ⚠️ Problemas Comuns

### "Não encontro o documento no Firestore"
- Certifique-se de que o **Document ID** é exatamente o **UID** do usuário
- O UID é um código longo (ex: `abc123xyz456...`)
- Verifique se está na coleção `users` (não `user`)

### "O campo isAdmin está como false"
- Mude para `true` (verdadeiro)
- Salve o documento
- Faça logout e login novamente

### "Ainda não aparece após fazer tudo"
- Verifique se você está logado com o usuário correto
- Verifique se o UID do documento corresponde ao UID do usuário autenticado
- Limpe o cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R)
- Verifique o Console do navegador (F12) para erros

## 📝 Estrutura Correta do Documento

O documento deve ter esta estrutura:

```
users/{UID_DO_USUARIO}
  ├── email: "seu@email.com" (string)
  ├── isAdmin: true (boolean) ⚠️ DEVE SER TRUE!
  └── blocked: false (boolean)
```

## ✅ Checklist

- [ ] Copiei o UID do usuário
- [ ] Verifiquei se o documento existe no Firestore
- [ ] Criei/editei o documento com `isAdmin: true`
- [ ] Fiz logout na aplicação
- [ ] Fiz login novamente
- [ ] O menu "Admin" aparece

Se tudo estiver correto, o menu "Admin" aparecerá! 🎉
