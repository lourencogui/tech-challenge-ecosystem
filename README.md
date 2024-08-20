## Setup:
    docker compose up -d api

### Comandos úteis:
    docker compose exec api npm run db:create
    docker compose exec api npm run db:migrate
    docker compose exec api npm run db:revert

### TODO
  - Utilizar a transaction do postgres durante o fluxo de criação de transações e recebíveis
  - Validar se a transação poderia ser repetida
  - Melhorar a tolerância a falhas da aplicação, utilizando um sistema de mensageria para garantir a consistência dos dados
  - Colocar validações nos DTOs 
  - Tratamento de exceções durante o fluxo de criação de transações e recebíveis
  - Implementar testes de integração a partir dos controllers
  - Implementar autenticação
