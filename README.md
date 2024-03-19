# PT-BR 🇧🇷

# Tech Challenge

O desafio consiste em implementar novas **API's** para trabalhar com as transações de nossos merchants (vendedores).

## Nós precisamos que você implemente:

1. Um endpoint para processar transações e pagamentos de um determinado merchant (vendedor)

- Uma transação deve conter pelo menos:

  - O valor total da transação, formatado em string decimal
  - Descrição da transação, por exemplo "T-Shirt Black M"
  - Método de pagamento: **debit_card** ou **credit_card**
  - O número do cartão (devemos armazenar e retornar somente os últimos 4 dígitos do cartão, por ser uma informação sensível)
  - O nome do dono do cartão
  - Data de Expiração
  - CVV do cartão
  - O id do merchant (vendedor)

  Exemplo de transação:

  ```json
  {
    "value": "340.30",
    "description": "T-Shirt Black/M",
    "method": "credit_card",
    "cardNumber": "3486",
    "cardHolderName": "Fonsi Julian",
    "cardExpirationDate": "04/28",
    "cardCvv": "290",
    "id": "KiV2szQ",
    "merchantId": 2441
  }
  ```

- Ao criar uma transação, também deve ser criado um recebível do merchant (payables), com as seguintes regras de negócio:

  - Transação **Debit card**:

    - O payable deve ser criado com **status = paid**, indicando que o merchant irá receber o valor
    - O payable deve ser criado com a data igual a data de criação (D + 0).

  - Transação **Credit card**:

    - O payable deve ser criado com **status = waiting_funds**, indicando que o merchant irá receber esse valor no futuro
    - O Payable deve ser criado com a data igual a data de criação da transação + 30 dias (D + 30)

  - Ao criar payables, devemos descontar uma taxa de processamento (chamada de `fee`). Considere **2%** para transações **debit_card**
    e **4%** para transações **credit_card**. Exemplo: Quando um payable é criado no valor de R$ 100,00 a partir de uma transação **credit_card** ele receberá R$ 96,00.

    Exemplo de payable:

    ```json
    {
      "id": "1",
      "status": "paid",
      "create_date": "15/03/2020",
      "subtotal": "200",
      "discount": "4",
      "total": "196",
      "merchantId": 2441
    }
    ```

2. Um endpoint que calcule o total de Recebíveis (payables) do merchant por período, a resposta deve conter:

- Valor total de recebíveis pagos
- Total cobrado de taxa nos recebíveis pagos
- Valor a receber para o futuro

## Pré-requisitos

Você pode utilizar qualquer linguagem de programação (recomendamos que utilize a que você possui maior familiaridade), frameworks e biblioteca

Para a execução do projeto, é necessário configurar um banco de dados, de preferência relacional, para armazenar os dados(transactions e payables). Recomenda-se utilizar Docker para facilitar o gerenciamento do ambiente de desenvolvimento.

### Configuração do Banco de Dados

O banco de dados deve ser iniciado utilizando o seguinte comando:

```bash
docker compose up
```

## Critérios de avaliação

- Assertividade: A aplicação está fazendo o que é esperado? Se algo estiver faltando, o README explica o motivo?
- Legibilidade do código (incluindo comentários)
- Segurança: Existem vulnerabilidades claras?
- Cobertura de testes (Não esperamos cobertura completa)
- Histórico de commits (estrutura e qualidade)
- Escolhas técnicas: A escolha de bibliotecas, banco de dados, arquitetura, etc., é a melhor escolha para a aplicação?
- Escalabilidade: A aplicação é capaz de lidar com um aumento significativo do tráfego?
- Manutenibilidade: O código é fácil de manter e modificar?
- Resiliência: A aplicação é resiliente a falhas e erros inesperados?

## Como entregar

- Fork esse desafio no seu repositório pessoal. Crie uma branch para desenvolver sua implementação e, assim que finalizar, submeta um pull request na branch main desse repo, marcando @ewma18, @AndreAffonso e @rafaelito91 como reviewers
