# 🔍 Verificar Configuração do .env

## Como Verificar se o .env Está Correto

Execute este comando no terminal para ver se o arquivo está preenchido:

```bash
cd medicina-platform
cat .env
```

## O que Você Deve Ver

### ❌ ERRADO (valores de exemplo):
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
```

### ✅ CORRETO (valores reais):
```env
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto-12345.firebaseapp.com
```

## Se Ainda Estiver com Valores de Exemplo

1. Siga o guia `CORRIGIR_API_KEY.md`
2. Obtenha as credenciais do Firebase Console
3. Preencha o arquivo `.env`
4. **Reinicie o servidor** (muito importante!)
