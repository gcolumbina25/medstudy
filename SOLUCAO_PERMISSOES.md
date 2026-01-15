# 🔧 Solução Completa para "Missing or insufficient permissions"

## ✅ Solução em 3 Passos

### Passo 1: Use Regras Simples Temporárias

No Firebase Console > Firestore Database > Rules, cole este código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras temporárias - permite tudo para usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Clique em "Publish"** e aguarde a confirmação.

### Passo 2: Verificar/Criar Documento do Usuário

1. No Firebase Console, vá em **Firestore Database**
2. Verifique se existe a coleção `users`
3. Verifique se existe um documento com o **UID** do seu usuário
4. Se **NÃO existir**, crie:
   - Coleção: `users`
   - Document ID: **Cole o UID do usuário** (encontre em Authentication > Users)
   - Campos:
     - `email` (string): seu e-mail
     - `isAdmin` (boolean): `true` (se for admin)
     - `blocked` (boolean): `false`

### Passo 3: Atualizar o Código

O código foi atualizado para criar automaticamente o documento do usuário se ele não existir. 

**Reinicie o servidor:**
```bash
# Pressione Ctrl+C para parar
npm run dev
```

## 🔍 Verificar se Funcionou

1. Faça **logout** na aplicação
2. Faça **login** novamente
3. Abra o Console do navegador (F12)
4. Verifique se há erros

## ⚠️ Se Ainda Não Funcionar

### Verificar no Console do Navegador

1. Abra o Console (F12)
2. Vá na aba **Console**
3. Procure por erros específicos
4. Me envie a mensagem de erro completa

### Verificar Autenticação

1. No Console do navegador, digite:
```javascript
// Verificar se está autenticado
console.log('Autenticado:', firebase.auth().currentUser);
```

### Verificar Firestore

1. No Firebase Console, vá em **Firestore Database**
2. Verifique se consegue ver a coleção `users`
3. Verifique se o documento do usuário existe

## 📝 Checklist

- [ ] Colei as regras simples no Firestore
- [ ] Publiquei as regras
- [ ] Verifiquei que o documento do usuário existe no Firestore
- [ ] Reiniciei o servidor (`npm run dev`)
- [ ] Fiz logout e login novamente
- [ ] Verifiquei o Console do navegador para erros

## 🎯 Próximos Passos

Depois que funcionar com as regras simples, podemos voltar para as regras mais seguras. Mas primeiro, vamos garantir que tudo está funcionando!
