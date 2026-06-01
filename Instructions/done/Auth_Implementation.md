# ESPECIFICAÇÃO: Fluxo de Cadastro e Login (Persistência Temporária)

## BACK-END (`/packages/server`)

### 1. Persistência em Arquivo (Mock DB)
- Salvar dados em: `/packages/server/data/users.json`
- Formato do JSON: `[{"email": "user@email.com", "password": "plain_password"}]`
- *Nota: Usar apenas para testes locais temporários.*

### 2. Rotas a Implementar / Modificar

#### POST /api/auth/register (Novo)
- **Ação:** Recebe `email` e `password` do front-end.
- **Regra de Negócio:** 1. Ler `users.json`. Se o arquivo não existir, iniciar array vazio `[]`.
  2. Validar se o `email` já está cadastrado. Se sim, retornar `400 Bad Request` ("E-mail já cadastrado").
  3. Adicionar o novo usuário ao array, dar `JSON.stringify()` e sobrescrever o `users.json`.
  4. Retornar `201 Created` ("Usuário criado com sucesso").

#### POST /api/auth/login (Atualizado)
- **Ação:** Recebe `email` e `password`.
- **Regra de Negócio:**
  1. Ler `users.json`.
  2. Buscar objeto correspondente ao `email` recebido.
  3. Se não encontrar OU se a senha estiver incorreta, retornar `401 Unauthorized` ("Credenciais inválidas").
  4. Se corretos, retornar `200 OK` + Token/Sessão simulada (ex: `{ login: true, email }`).

---

## FRONT-END (`/packages/client`)

### 1. Tela de Login / Cadastro (Interface Única ou Abas)
- Adicionar formulário de "Criar Conta" (Campos: Email e Senha) ao lado ou alternável com o de "Login".
- Inputs com validação nativa de HTML5 (`required`, `type="email"`).

### 2. Comportamento do JavaScript
- **Cadastro:** Evento `submit` dispara `fetch('/api/auth/register')`. Se sucesso, redireciona/alterna para o login e exibe alerta de sucesso.
- **Login:** Evento `submit` dispara `fetch('/api/auth/login')`. Se sucesso (200 OK), salva o estado de login no `localStorage` ou `sessionStorage` e libera o acesso à página de agendamento. Se erro (401), exibe mensagem de erro na tela.