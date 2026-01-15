# Guia de Cadastro de Conteúdos - MedStudy

Este guia explica como cadastrar conteúdos reais na plataforma MedStudy.

## 📋 Estrutura de Dados

A plataforma funciona com a seguinte hierarquia:
```
Ciclo → Tópico → Aula
```

## 🚀 Como Começar

### 1. Criar um Ciclo

1. Acesse o **Painel Admin** (menu superior)
2. Clique na aba **"Ciclos"**
3. Clique em **"+ Novo Ciclo"**
4. Preencha:
   - **Nome**: Ex: "Ciclo Básico"
   - **Descrição**: Breve descrição do ciclo
   - **URL da imagem de capa**: Link de uma imagem (recomendado: Unsplash, Imgur, etc.)
   - **Ordem**: Número para ordenação (1, 2, 3...)
5. Clique em **"Criar"**

**💡 Dica**: Para criar ciclos "Em Breve", você pode criar o ciclo normalmente e depois adicionar a propriedade `comingSoon: true` manualmente no Firestore, ou simplesmente não adicionar tópicos ainda.

### 2. Criar um Tópico

1. Na aba **"Ciclos"**, clique em **"Ver Tópicos"** no ciclo desejado
2. Isso abrirá a aba **"Tópicos"**
3. Clique em **"+ Novo Tópico"**
4. Preencha:
   - **Nome**: Ex: "Histologia"
   - **Descrição**: Breve descrição do tópico
   - **URL da imagem de capa**: Link de uma imagem
   - **Ordem**: Número para ordenação dentro do ciclo
5. Clique em **"Criar"**

### 3. Criar uma Aula

1. Na aba **"Tópicos"**, clique em **"Ver Aulas"** no tópico desejado
2. Clique em **"+ Nova Aula"**
3. Preencha:
   - **Título da aula**: Ex: "Introdução à Histologia"
   - **Código iframe do vídeo**: 
     - Vá ao Google Drive
     - Abra o vídeo
     - Clique em "Compartilhar" → "Obter link"
     - Configure como "Qualquer pessoa com o link pode visualizar"
     - Copie o ID do arquivo (ex: `11PWQZ2wTWaDMLzL2RjY8Wq_45b6nbz-H`)
     - Use o formato: `<iframe src="https://drive.google.com/file/d/ID_DO_ARQUIVO/preview" width="100%" height="100%" allow="autoplay"></iframe>`
   - **Código iframe do PDF** (opcional):
     - Mesmo processo do vídeo
     - Use o mesmo formato de iframe
     - Se não tiver PDF, deixe o campo vazio ou use o mesmo link do vídeo
   - **Ordem**: Número para ordenação dentro do tópico
4. Clique em **"Criar"**

### 4. Adicionar Documentos na Biblioteca

1. Na aba **"Biblioteca"**
2. Clique em **"+ Novo Documento"**
3. Preencha:
   - **Nome do documento**: Ex: "Livro de Anatomia"
   - **URL do PDF**: Link do Google Drive no formato view
     - Ex: `https://drive.google.com/file/d/ID_DO_ARQUIVO/view`
4. Clique em **"Criar"**

## 📝 Formato dos Links do Google Drive

### Para Vídeos e PDFs (Embed):
```
<iframe src="https://drive.google.com/file/d/ID_DO_ARQUIVO/preview" width="100%" height="100%" allow="autoplay"></iframe>
```

**Como obter o ID:**
1. Compartilhe o arquivo no Google Drive
2. Configure como "Qualquer pessoa com o link pode visualizar"
3. O link será: `https://drive.google.com/file/d/ID_DO_ARQUIVO/view`
4. Use o ID no formato acima

### Para Biblioteca (Link direto):
```
https://drive.google.com/file/d/ID_DO_ARQUIVO/view
```

## ⚙️ Ordenação

- **Ciclos**: Ordenados pelo campo `order` (menor para maior)
- **Tópicos**: Ordenados pelo campo `order` dentro de cada ciclo
- **Aulas**: Ordenadas pelo campo `order` dentro de cada tópico
- **Biblioteca**: Ordenada alfabeticamente pelo nome

## 🔒 Permissões

- Apenas usuários com `isAdmin: true` podem acessar o Painel Admin
- Para tornar um usuário admin, edite manualmente no Firestore:
  - Coleção: `users`
  - Documento do usuário
  - Campo: `isAdmin` = `true`

## 📚 Estrutura no Firestore

```
cycles/
  {cycleId}/
    name: string
    description: string
    imageUrl: string
    order: number
    comingSoon: boolean (opcional)
    createdAt: timestamp
    topics/
      {topicId}/
        name: string
        description: string
        imageUrl: string
        order: number
        createdAt: timestamp
        lessons/
          {lessonId}/
            title: string
            videoEmbed: string (HTML iframe)
            pdfEmbed: string (HTML iframe, opcional)
            order: number
            createdAt: timestamp

library/
  {documentId}/
    name: string
    pdfUrl: string
    createdAt: timestamp

users/
  {userId}/
    email: string
    isAdmin: boolean
    blocked: boolean
    createdAt: timestamp
    lastAccess: timestamp
```

## ✅ Checklist de Cadastro

- [ ] Criar ciclos (Ciclo Básico, Ciclo Clínico, etc.)
- [ ] Criar tópicos dentro de cada ciclo
- [ ] Criar aulas dentro de cada tópico
- [ ] Adicionar vídeos (Google Drive embed)
- [ ] Adicionar PDFs (Google Drive embed, opcional)
- [ ] Adicionar documentos na Biblioteca
- [ ] Verificar ordenação (campo `order`)
- [ ] Testar visualização como usuário comum

## 🎯 Dicas Importantes

1. **Imagens**: Use URLs de imagens públicas (Unsplash, Imgur, etc.)
2. **Vídeos/PDFs**: Sempre configure como "Qualquer pessoa com o link pode visualizar" no Google Drive
3. **Ordem**: Use números sequenciais (1, 2, 3...) para facilitar a organização
4. **Teste**: Sempre teste como usuário comum após criar conteúdos
5. **Backup**: Considere fazer backup periódico do Firestore

## 🆘 Problemas Comuns

### Vídeo/PDF não aparece
- Verifique se o link está no formato correto
- Confirme que o arquivo está compartilhado publicamente no Google Drive
- Use o formato `/preview` para embed

### Tópico não aparece
- Verifique se o ciclo foi selecionado antes de criar o tópico
- Confirme que o campo `order` está preenchido

### Aula não aparece
- Verifique se o tópico foi selecionado antes de criar a aula
- Confirme que o campo `order` está preenchido

---

**Pronto para começar!** 🚀
