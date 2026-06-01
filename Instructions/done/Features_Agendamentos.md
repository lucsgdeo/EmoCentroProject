# ESPECIFICAÇÃO: Persistência e Gerenciamento de Agendamentos

## 1. PERSISTÊNCIA EM "BANCO DE DADOS" (Mock JSON)
- Arquivo: `/packages/server/data/agendamentos.json`
- Estrutura do Objeto: `{ id, userEmail, hemocentroId, data, hora }`

## 2. ROTAS A IMPLEMENTAR (`/packages/server`)
*Nota: Todas as rotas abaixo exigem validação de usuário logado (401 se deslogado).*

- `POST /api/agendamentos`: Recebe agendamento, gera ID único, salva no JSON e gera log `[INFO]`.
- `GET /api/agendamentos`: Lê o arquivo JSON e filtra para retornar **apenas** os agendamentos pertencentes ao e-mail do usuário logado.
- `PUT /api/agendamentos/:id`: Atualiza a `data` e `hora` do agendamento correspondente ao ID (Reagendamento).
- `DELETE /api/agendamentos/:id`: Remove o agendamento do arquivo correspondente ao ID (Cancelamento).

## 3. INTERFACE DE GERENCIAMENTO (`/packages/client`)
- Criar a página `/agendamentos.html`.
- Ao carregar, faz `GET /api/agendamentos` e renderiza uma lista/tabela de cards com os agendamentos do usuário.
- Cada card deve conter:
  - Dados do Hemocentro, Data e Hora.
  - Botão **"Reagendar"**: Abre um modal/form para escolher nova data/hora e dispara o `PUT`.
  - Botão **"Cancelar Agendamento"**: Dispara o `DELETE` após confirmação e remove o card da tela.