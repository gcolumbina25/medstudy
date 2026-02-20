# Medicina Platform - Ciclo Básico

Plataforma web privada de estudos para estudantes do curso de Medicina.

## Sistema de Login

A plataforma utiliza autenticação exclusiva via Google. O acesso é controlado por uma lista de e-mails permitidos gerenciada pelos administradores.

### Para Administradores

1. **Adicionar E-mails Permitidos**: No painel admin, acesse a aba "E-mails Permitidos" e adicione endereços de e-mail autorizados.
2. **Definir Administradores**: Marque a opção "Administrador" ao adicionar e-mails para conceder privilégios administrativos.
3. **Gerenciar Acesso**: Remova e-mails da lista para revogar acesso.

### Para Usuários

1. **Login**: Clique em "Entrar com Google" na página de login.
2. **Primeiro Acesso**: Se seu e-mail estiver na lista permitida, sua conta será criada automaticamente.
3. **Acesso Negado**: Se receber "Usuário não cadastrado", entre em contato com o administrador.

### Migração

Se estiver migrando de um sistema anterior, consulte `MIGRACAO_EMAILS_PERMITIDOS.md` para instruções detalhadas.
