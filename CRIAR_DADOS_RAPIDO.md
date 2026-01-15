# ⚡ Criar Dados Rápido - Passo a Passo Visual

## 🎯 Objetivo: Criar 1 Tópico com 1 Aula para Testar

### Passo 1: Criar Tópico no Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto
3. Vá em **Firestore Database**
4. Clique em **"Start collection"**
5. **Collection ID:** `topics`
6. Clique em **"Next"**

**Adicionar Campos:**
- Clique em **"Add field"**
- Campo 1:
  - Field: `name`
  - Type: `string`
  - Value: `Bioquímica`
- Campo 2:
  - Field: `description`
  - Type: `string`
  - Value: `Estudo das reações químicas`
- Campo 3:
  - Field: `imageUrl`
  - Type: `string`
  - Value: `https://images.unsplash.com/photo-1532619675605-1ede6c9ed2d7?w=800`
- Campo 4:
  - Field: `order`
  - Type: `number`
  - Value: `1`
- Clique em **"Save"**

**✅ Anote o ID do documento criado!** (aparece no topo, algo como: `abc123xyz`)

### Passo 2: Criar Aula Dentro do Tópico

1. Clique no documento do tópico que você acabou de criar
2. Clique em **"Start subcollection"**
3. **Collection ID:** `lessons`
4. Clique em **"Next"`

**Adicionar Campos:**
- Campo 1:
  - Field: `title`
  - Type: `string`
  - Value: `Introdução à Bioquímica`
- Campo 2:
  - Field: `videoEmbed`
  - Type: `string`
  - Value: `<iframe src="https://drive.google.com/file/d/1AL4aXtByXIi_GFbbzrPX2lktuzU1jvlG/preview" width="640" height="480"></iframe>`
- Campo 3:
  - Field: `pdfEmbed`
  - Type: `string`
  - Value: `<iframe src="https://drive.google.com/file/d/1AL4aXtByXIi_GFbbzrPX2lktuzU1jvlG/preview" width="640" height="480"></iframe>`
- Campo 4:
  - Field: `order`
  - Type: `number`
  - Value: `1`
- Clique em **"Save"`

### Passo 3: Verificar na Aplicação

1. Volte para a aplicação: `http://localhost:5173`
2. **Recarregue a página** (F5 ou Ctrl+R)
3. Você deve ver o card "Bioquímica" no dashboard! ✅

### Passo 4: Usar Painel Admin para Criar Mais

Agora que você tem pelo menos 1 tópico:

1. Na aplicação, clique em **"Admin"** no menu
2. Use o formulário para criar mais tópicos e aulas
3. É muito mais fácil que criar manualmente no Firebase! 🎉

---

## 🎬 Vídeo Passo a Passo (Texto)

### Estrutura de Dados:

```
Firestore Database
└── topics (coleção)
    └── [documento-id] (documento do tópico)
        ├── name: "Bioquímica"
        ├── description: "..."
        ├── imageUrl: "..."
        ├── order: 1
        └── lessons (subcoleção)
            └── [documento-id] (documento da aula)
                ├── title: "Introdução..."
                ├── videoEmbed: "<iframe...>"
                ├── pdfEmbed: "<iframe...>"
                └── order: 1
```

---

## ⚠️ Problemas Comuns

### "Não vejo o tópico na aplicação"
- Recarregue a página (F5)
- Verifique se o tópico foi criado na coleção `topics` (não `topic`)
- Verifique se todos os campos foram preenchidos

### "Erro ao criar subcoleção"
- Certifique-se de clicar no **documento do tópico** primeiro
- Depois clique em "Start subcollection"
- O nome da subcoleção deve ser exatamente `lessons` (plural)

### "Não consigo criar no Firebase Console"
- Verifique se você está logado no Firebase
- Certifique-se de que o Firestore está criado
- Tente em outro navegador se necessário

---

## ✅ Checklist

- [ ] Criei a coleção `topics`
- [ ] Criei 1 documento com os campos: name, description, imageUrl, order
- [ ] Criei a subcoleção `lessons` dentro do tópico
- [ ] Criei 1 documento de aula com os campos: title, videoEmbed, pdfEmbed, order
- [ ] Recarreguei a aplicação
- [ ] Vejo o card do tópico no dashboard

Se tudo estiver marcado, você está pronto! 🎉
