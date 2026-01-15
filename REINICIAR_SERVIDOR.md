# 🔄 Como Reiniciar o Servidor

## ⚠️ Se a Aplicação Não Estiver Abrindo

### Método 1: Reiniciar Manualmente

1. Abra o terminal
2. Navegue até o projeto:
   ```bash
   cd /Users/columbina/medicina-platform
   ```
3. Execute:
   ```bash
   npm run dev
   ```
4. Aguarde ver a mensagem:
   ```
   ➜  Local:   http://localhost:5173/
   ```
5. Acesse: `http://localhost:5173`

### Método 2: Verificar se a Porta Está Ocupada

Se a porta 5173 estiver ocupada:

1. Encontre o processo:
   ```bash
   lsof -ti:5173
   ```
2. Mate o processo:
   ```bash
   kill -9 $(lsof -ti:5173)
   ```
3. Reinicie o servidor:
   ```bash
   npm run dev
   ```

### Método 3: Usar Outra Porta

Se necessário, você pode usar outra porta:

```bash
npm run dev -- --port 3000
```

Depois acesse: `http://localhost:3000`

## 🔍 Verificar Problemas

### Verificar Erros no Terminal

Quando executar `npm run dev`, verifique se há erros no terminal. Erros comuns:

- **"Port already in use"**: A porta 5173 está ocupada
- **"Cannot find module"**: Dependências não instaladas
- **Erros de sintaxe**: Problema no código

### Verificar Erros no Navegador

1. Abra o Console do navegador (F12)
2. Vá na aba **Console**
3. Procure por erros em vermelho
4. Me envie a mensagem de erro completa

## ✅ Checklist

- [ ] Estou no diretório correto (`medicina-platform`)
- [ ] Executei `npm run dev`
- [ ] Vejo a mensagem "Local: http://localhost:5173"
- [ ] Acessei `http://localhost:5173` no navegador
- [ ] Não há erros no terminal
- [ ] Não há erros no Console do navegador

## 🆘 Se Nada Funcionar

1. Pare o servidor (Ctrl+C)
2. Limpe o cache:
   ```bash
   rm -rf node_modules/.vite
   ```
3. Reinicie:
   ```bash
   npm run dev
   ```

Se ainda não funcionar, me envie:
- A mensagem de erro completa do terminal
- A mensagem de erro do Console do navegador (F12)
