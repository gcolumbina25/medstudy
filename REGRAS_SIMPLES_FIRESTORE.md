# 🔧 Regras Simples do Firestore (Para Teste)

## ⚠️ Se as regras complexas não funcionarem, use estas regras temporárias:

Cole este código no Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite tudo para usuários autenticados (APENAS PARA TESTE)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ IMPORTANTE:** Essas regras são menos seguras, mas permitem que qualquer usuário autenticado acesse tudo. Use apenas para testar se o problema é nas regras ou em outro lugar.

## 📋 Passos:

1. Cole o código acima no Firebase Console
2. Clique em **"Publish"**
3. Faça **logout** na aplicação
4. Faça **login** novamente
5. Teste se funciona

Se funcionar com essas regras simples, o problema está nas regras complexas. Se não funcionar, o problema pode ser:
- Usuário não está autenticado corretamente
- Documento do usuário não existe no Firestore
- Algum outro problema de configuração
