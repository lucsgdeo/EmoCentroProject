# PROJETO: ConectaSangue ABC (Foco: Diadema-SP)
## ARQUITETURA: Monorepo

## WORKSPACES / ESTRUTURA DE PASTAS
- `/packages/server` -> API Back-end (Node.js)
- `/packages/client` -> App Front-end (HTML, CSS, JS Vanilla)

## STACK
- Front: HTML5, CSS3, JavaScript (Responsivo, Acessível, Sem Frameworks)
- Back: Node.js (JavaScript, API REST, Express ou nativo)

## REQUISITOS & ROTAS (BACK-END - `/packages/server`)
### Auth
- POST /api/auth/login -> Login simples. Precede agendamento.
### Hemocentros
- GET /api/hemocentros -> Lista locais (ABC/Diadema) por proximidade.
- Retorno: { id, nome, endereco, telefone, lat, lng }
### Agendamento
- POST /api/agendamentos -> Cria agendamento (Requer Token/Auth)

## SEED DATA (Mock API)
- Hosp. Estadual Diadema: R. José Bonifácio, 1641 - Serraria, Diadema - SP | (11) 3583-1475
- Hosp. Mário Covas: Rua Dr. Henrique Calderazzo, 321 - Santo André - SP | (11) 2324-5780
- Colsan SBC: Rua Pedro Jacobucci, 440 - Jardim das Américas, SBC - SP | (11) 2111-0007

## INTERFACE (FRONT-END - `/packages/client`)
### Globais
- Header & Footer modernos e responsivos em todas as telas.
### Páginas
1. Home/Busca: Input de localização + Mapa interativo + Listagem de cards dinâmicos.
2. Login: Form acessível (alto contraste, tags semânticas).
3. Agendamento: Calendário e horários (Disponível apenas pós-login).