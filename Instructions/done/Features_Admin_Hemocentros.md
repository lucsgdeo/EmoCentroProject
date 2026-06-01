# ESPECIFICAÇÃO: Sistema de Logs, Dados Reais e Cadastro de Hemocentros

## 1. SISTEMA DE LOGS (`/packages/server`)
- Criar um middleware ou utilitário de log simples salvando em `/packages/server/logs/app.log`.
- **Ações Críticas a Logar (Formato: [TIMESTAMP] [TIPO] Mensagem):**
  - `[INFO]` Criação de usuário (Ex: "Usuário user@email.com criado com sucesso").
  - `[INFO]` Login de usuário (Ex: "Usuário user@email.com logou no sistema").
  - `[ERROR]` Erros internos/Bugs (Ex: "Erro ao ler arquivo users.json: <stack_trace>").

## 2. CADASTRO DE NOVOS HEMOCENTROS
- **Rota:** `POST /api/hemocentros`
- **Regra de Segurança:** Requer cabeçalho de autenticação (Token/Session). Se não estiver logado, retornar `401 Unauthorized`.
- **Payload:** `{ nome, endereco, telefone, lat, lng }`
- **Ação:** Validar campos obrigatórios, adicionar ao `hemocentros.json` e salvar. Emitir log `[INFO]`.