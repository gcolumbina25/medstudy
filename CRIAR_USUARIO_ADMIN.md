# 👤 Como Criar Usuário Admin - Passo a Passo Visual

## Passo 1: Criar Usuário no Authentication

1. No Firebase Console, vá em **Authentication**
2. Clique na aba **"Users"** ou **"Usuários"**
3. Clique no botão **"+ Add user"** ou **"+ Adicionar usuário"**
4. Preencha:
   - **Email:** `admin@teste.com` (ou qualquer e-mail)
   - **Password:** `123456` (mínimo 6 caracteres)
5. Clique em **"Add user"** ou **"Adicionar usuário"**
6. **IMPORTANTE:** Copie o **UID** do usuário criado (aparece na lista, é um código longo)

## Passo 2: Criar Documento no Firestore

1. No Firebase Console, vá em **Firestore Database**
2. Clique em **"Start collection"** ou **"Iniciar coleção"**
3. **Collection ID:** Digite `users` (sem aspas)
4. Clique em **"Next"** ou **"Próximo"**

### Adicionar Campos:

5. **Document ID:** Cole o **UID** que você copiou no Passo 1
6. Clique em **"Add field"** ou **"Adicionar campo"** para cada campo abaixo:

#### Campo 1: `email`
- **Field:** `email`
- **Type:** Selecione `string`
- **Value:** Digite o e-mail que você usou (ex: `admin@teste.com`)
- Clique em **"Done"** ou **"Concluído"**

#### Campo 2: `isAdmin`
- Clique em **"Add field"** novamente
- **Field:** `isAdmin`
- **Type:** Selecione `boolean`
- **Value:** Selecione `true` (verdadeiro)
- Clique em **"Done"**

#### Campo 3: `blocked`
- Clique em **"Add field"** novamente
- **Field:** `blocked`
- **Type:** Selecione `boolean`
- **Value:** Selecione `false` (falso)
- Clique em **"Done"**

#### Campo 4: `createdAt` (OPCIONAL)
- Clique em **"Add field"** novamente
- **Field:** `createdAt`
- **Type:** Selecione `timestamp`
- **Value:** 
  - **OPÇÃO 1 (Recomendada):** Deixe os campos Data e Hora vazios. O sistema preencherá automaticamente quando você fizer login.
  - **OPÇÃO 2:** Preencha manualmente com a data e hora de hoje
- Clique em **"Done"**

7. Clique em **"Save"** ou **"Salvar"**

## ✅ Pronto!

Agora você pode fazer login com:
- **Email:** `admin@teste.com` (ou o que você usou)
- **Senha:** `123456` (ou a que você definiu)

## 🔍 Verificar se Funcionou

1. Acesse a aplicação: `http://localhost:5173`
2. Faça login com as credenciais criadas
3. Se você ver o menu **"Admin"** no topo, está funcionando! ✅

## ⚠️ Problemas Comuns

### "Acesso negado" no Admin
- Verifique se o **UID** do documento no Firestore é exatamente igual ao **UID** do usuário no Authentication
- Confirme que o campo `isAdmin` está como `true` (verdadeiro)
- Certifique-se de que o campo `blocked` está como `false` (falso)

### Não consigo fazer login
- Verifique se o usuário existe em **Authentication** > **Users**
- Confirme que a senha está correta
- Verifique se o e-mail está no formato correto (ex: `usuario@email.com`)

### O campo `createdAt` não aparece
- **Não é problema!** O campo `createdAt` é opcional
- Você pode criar o usuário sem ele
- Ele será preenchido automaticamente quando você fizer login
