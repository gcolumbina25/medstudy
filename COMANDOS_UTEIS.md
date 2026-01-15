# 📝 Comandos Úteis

## 🚀 Iniciar o Servidor

```bash
cd medicina-platform
npm run dev
```

O servidor iniciará em: **http://localhost:5173**

## 🛑 Parar o Servidor

Pressione `Ctrl + C` no terminal

## 🔄 Reiniciar o Servidor

1. Pressione `Ctrl + C` para parar
2. Execute novamente: `npm run dev`

## 📦 Build para Produção

```bash
cd medicina-platform
npm run build
```

## 🔍 Verificar se Está no Diretório Correto

```bash
pwd
# Deve mostrar: /Users/columbina/medicina-platform
```

## 📂 Listar Arquivos do Projeto

```bash
cd medicina-platform
ls
```

## ⚠️ Se Aparecer "Missing script: dev"

Isso significa que você não está no diretório correto. Execute:

```bash
cd /Users/columbina/medicina-platform
npm run dev
```

## 🐛 Ver Logs do Servidor

Os logs aparecem diretamente no terminal onde você executou `npm run dev`

## 💡 Dica

Sempre execute os comandos a partir do diretório `medicina-platform`:

```bash
cd medicina-platform
# Agora você pode executar:
npm run dev
npm run build
# etc.
```
