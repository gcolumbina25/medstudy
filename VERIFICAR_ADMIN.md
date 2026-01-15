# 🔍 Como Verificar e Corrigir o Menu Admin

## ❌ Problema: Menu "Admin" não aparece

Isso acontece quando o documento do usuário no Firestore não tem `isAdmin: true`.

## ✅ Solução Passo a Passo

### Passo 1: Verificar o UID do Usuário

1. Na aplicação, abra o **Console do navegador** (F12)
2. Vá na aba **Console**
3. Digite e pressione Enter:
   ```javascript
   // Verificar usuário atual
   console.log('UID:', firebase.auth().currentUser?.uid);
   ```
4. **COPIE o UID** que aparecer (é um código longo)

**OU** faça assim:
1. No Firebase Console, vá em **Authentication** > **Users**
2. Encontre seu usuário
3. **COPIE o UID** (aparece na lista)

### Passo 2: Verificar/Criar Documento no Firestore

1. No Firebase Console, vá em **Firestore Database**
2. Verifique se existe a coleção `users`
3. Verifique se existe um documento com o **UID** que você copiou

### Passo 3: Criar ou Editar o Documento

#### Se o documento NÃO existe:

1. Clique em **"Start collection"** ou **"Iniciar coleção"**
2. **Collection ID:** `users`
3. Clique em **"Next"**
4. **Document ID:** Cole o **UID** que você copiou
5. Adicione os campos:
   - `email` (string): seu e-mail
   - `isAdmin` (boolean): **`true`** ⚠️ MUITO IMPORTANTE!
   - `blocked` (boolean): `false`
6. Clique em **"Save"**

#### Se o documento JÁ existe:

1. Clique no documento do usuário
2. Verifique se existe o campo `isAdmin`
3. Se **NÃO existir**, adicione:
   - Clique em **"Add field"**
   - Field: `isAdmin`
   - Type: `boolean`
   - Value: **`true`** ⚠️
   - Clique em **"Done"**
4. Se **JÁ existir** mas está como `false`:
   - Clique no campo `isAdmin`
   - Mude o valor para **`true`**
   - Clique em **"Save"**

### Passo 4: Recarregar a Aplicação

1. Volte para a aplicação (`http://localhost:5173`)
2. Faça **logout** (clique em "Sair")
3. Faça **login** novamente
4. O menu **"Admin"** deve aparecer! ✅

## 🔍 Verificar no Console do Navegador

Para verificar se está funcionando:

1. Abra o Console (F12)
2. Digite:
   ```javascript
   // Verificar dados do usuário
   // Isso só funciona se você tiver acesso ao contexto
   ```
3. Ou simplesmente verifique se o menu "Admin" aparece após fazer logout/login

## ⚠️ Problemas Comuns

### "O documento não existe"
- Crie o documento seguindo o Passo 3 acima
- Certifique-se de que o **Document ID** é exatamente o **UID** do usuário

### "O campo isAdmin está como false"
- Mude para `true` (verdadeiro)
- Salve o documento
- Faça logout e login novamente

### "Ainda não aparece após fazer tudo"
- Verifique se você está logado com o usuário correto
- Verifique se o UID do documento corresponde ao UID do usuário autenticado
- Limpe o cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R)
- Verifique o Console do navegador para erros

## 📝 Checklist

- [ ] Copiei o UID do usuário
- [ ] Verifiquei se o documento existe no Firestore
- [ ] Criei/editei o documento com `isAdmin: true`
- [ ] Fiz logout na aplicação
- [ ] Fiz login novamente
- [ ] O menu "Admin" aparece

## 🎯 Estrutura Correta do Documento

O documento do usuário deve ter esta estrutura:

```
users/{UID_DO_USUARIO}
  ├── email: "seu@email.com" (string)
  ├── isAdmin: true (boolean) ⚠️ IMPORTANTE!
  ├── blocked: false (boolean)
  └── createdAt: (timestamp - opcional)
```

Se tudo estiver correto, o menu "Admin" aparecerá! 🎉
