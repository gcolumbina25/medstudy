# 📚 Como Cadastrar Conteúdo Real

## 🎯 Método Recomendado: Painel Administrativo

A forma mais fácil e rápida de cadastrar conteúdo é usando o **Painel Administrativo** da aplicação.

### Passo 1: Acessar o Painel Admin

1. Faça login na aplicação como **administrador**
2. Clique em **"Admin"** no menu de navegação
3. Você verá abas para gerenciar: **Ciclos**, **Tópicos**, **Biblioteca** e **Usuários**

### Passo 2: Criar um Ciclo

1. Na aba **"Ciclos"**, clique em **"+ Novo Ciclo"**
2. Preencha os campos:
   - **Nome do ciclo**: Ex: "Ciclo Básico"
   - **Descrição**: Descrição do ciclo
   - **URL da imagem de capa**: URL de uma imagem (ex: Unsplash, Imgur, etc.)
   - **Ordem**: Número para ordenação (1, 2, 3...)
3. Clique em **"Criar"**

### Passo 3: Criar Tópicos dentro do Ciclo

1. Após criar um ciclo, clique em **"Ver Tópicos"** no ciclo desejado
2. Clique em **"+ Novo Tópico"**
3. Preencha os campos:
   - **Nome do tópico**: Ex: "Bioquímica"
   - **Descrição**: Descrição do tópico
   - **URL da imagem de capa**: URL de uma imagem
   - **Ordem**: Número para ordenação
4. Clique em **"Criar"**

### Passo 4: Criar Aulas dentro do Tópico

1. Após criar um tópico, clique em **"Ver Aulas"** no tópico desejado
2. Clique em **"+ Nova Aula"**
3. Preencha os campos:
   - **Título da aula**: Ex: "Introdução à Bioquímica"
   - **Código iframe do vídeo**: Cole o código iframe completo do Google Drive
     - Exemplo: `<iframe src="https://drive.google.com/file/d/SEU_ID_AQUI/preview" width="640" height="480"></iframe>`
   - **Código iframe do PDF**: Cole o código iframe completo do Google Drive
   - **Ordem**: Número para ordenação
4. Clique em **"Criar"**

### Passo 5: Adicionar Documentos à Biblioteca

1. Na aba **"Biblioteca"**, clique em **"+ Novo Documento"**
2. Preencha:
   - **Nome do documento**: Ex: "Livro de Anatomia"
   - **URL do PDF**: URL completa do PDF no Google Drive (formato view)
3. Clique em **"Criar"**

---

## 📝 Como Obter o Código iframe do Google Drive

### Para Vídeos e PDFs:

1. Faça upload do arquivo no Google Drive
2. Clique com botão direito no arquivo → **"Obter link"**
3. Configure a permissão como **"Qualquer pessoa com o link pode visualizar"**
4. Copie o link (formato: `https://drive.google.com/file/d/ID_DO_ARQUIVO/view`)
5. Substitua `/view` por `/preview` no final do link
6. Use este formato no iframe:
   ```html
   <iframe src="https://drive.google.com/file/d/ID_DO_ARQUIVO/preview" width="640" height="480"></iframe>
   ```

---

## 🔄 Estrutura de Dados no Firestore

A aplicação usa a seguinte estrutura:

```
Firestore Database
└── cycles (coleção)
    └── [cycleId] (documento do ciclo)
        ├── name: string
        ├── description: string
        ├── imageUrl: string
        ├── order: number
        └── topics (subcoleção)
            └── [topicId] (documento do tópico)
                ├── name: string
                ├── description: string
                ├── imageUrl: string
                ├── order: number
                └── lessons (subcoleção)
                    └── [lessonId] (documento da aula)
                        ├── title: string
                        ├── videoEmbed: string (código iframe)
                        ├── pdfEmbed: string (código iframe)
                        └── order: number
└── library (coleção)
    └── [documentId]
        ├── name: string
        └── pdfUrl: string
└── users (coleção)
    └── [userId]
        ├── email: string
        ├── isAdmin: boolean
        └── blocked: boolean
```

---

## ⚠️ Dicas Importantes

1. **Ordem dos itens**: Use números sequenciais (1, 2, 3...) para ordenar ciclos, tópicos e aulas
2. **Imagens**: Use URLs de imagens públicas (Unsplash, Imgur, etc.) ou hospede suas próprias
3. **Google Drive**: Certifique-se de que os arquivos estão com permissão pública de visualização
4. **Primeiro cadastro**: Crie pelo menos 1 ciclo, 1 tópico e 1 aula para testar a aplicação

---

## ✅ Checklist Inicial

- [ ] Criei pelo menos 1 ciclo
- [ ] Criei pelo menos 1 tópico dentro do ciclo
- [ ] Criei pelo menos 1 aula dentro do tópico
- [ ] Testei visualizar o conteúdo na aplicação
- [ ] Verifiquei que os vídeos/PDFs carregam corretamente

---

## 🆘 Problemas Comuns

### "Não vejo o conteúdo na aplicação"
- Recarregue a página (F5)
- Verifique se você está logado
- Verifique se os dados foram salvos no Firestore

### "Vídeos/PDFs não aparecem"
- Verifique se o arquivo no Google Drive está com permissão pública
- Confirme que o código iframe está completo e correto
- Teste o link diretamente no navegador

### "Não consigo criar no painel admin"
- Verifique se você está logado como administrador
- Confirme que o campo `isAdmin` está como `true` no seu usuário no Firestore
