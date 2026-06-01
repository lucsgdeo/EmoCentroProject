# ESPECIFICAÇÃO: Arquitetura de Páginas e Conteúdo do Front-end

## 1. REORGANIZAÇÃO DE TELAS (`/packages/client`)

### `/index.html` (Home de Conscientização)
- **Foco:** Landing page informativa sobre a importância da doação de sangue.
- **Conteúdo:** Estatísticas rápidas de como uma doação salva até 4 vidas, requisitos básicos para doar (peso, idade, saúde) e um botão de Call-to-Action (CTA) destacado: "Encontre um Hemocentro Próximo".

### `/hemocentros.html` (Nova Página Dedicada)
- Interface contendo o mapa interativo e a listagem completa de cards dos hemocentros.
- Exibe o botão "Agendar Doação" em cada card (que redireciona para login se deslogado).
- Inclui o formulário "Cadastrar Novo Hemocentro" (oculto por padrão, visível apenas se o usuário estiver logado).

### `/sobre.html` (Aba do Projeto)
- Página institucional limpa.
- **Texto Obrigatório:**
  > "Este é um projeto pessoal desenvolvido para a faculdade Centro Universitário Internacional UNINTER. O sistema possui caráter puramente experimental e acadêmico. Atenção: Por motivos de segurança, NÃO utilize e-mails ou senhas reais neste ambiente."