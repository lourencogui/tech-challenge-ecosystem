# Tech Challenge Ecosystem

Mini api para o processamento de transações e recebíveis.

## Pré-requisitos

Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)


## Setup:
    - dentro do diretório do projeto, execute o comando: `docker compose up -d api`
    - A api expõe a porta 3000, verifique se deu tudo certo acessando a rota http://localhost:3000 no seu navegador



### Comandos úteis:
    `docker compose exec api npm run db:create`
    `docker compose exec api npm run db:migrate`
    `docker compose exec api npm run db:revert`

### TODO
  - Utilizar a transaction do postgres durante o fluxo de criação de transações e recebíveis
  - Validar se a transação poderia ser repetida
  - Melhorar a tolerância a falhas da aplicação, utilizando um sistema de mensageria para garantir a consistência dos dados
  - Colocar validações nos DTOs 
  - Tratamento de exceções durante o fluxo de criação de transações e recebíveis
  - Implementar testes de integração a partir dos controllers
  - Implementar autenticação


### Rotas

GET /transactions

POST /transactions/create
```json
{
  "amount": 200,
  "description": "Teclado",
  "paymentMethod": "credit_card",
  "cardNumber": "1121",
  "cardHolderName": "Guilherme Lourenco",
  "cardExpirationDate": "12/24",
  "cardCvv": "123",
  "merchantId": 16
}
```

GET /payables/:merchantId?minDate=2024-08-01&maxDate=2024-08-25


