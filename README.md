**Instalação e Configuração**
Clone o código do GitHub:
- git clone 'URL'
Siga os passos abaixo (no terminal do VS Code) para rodar o código:
- npm install
- npm run prisma:migrate
- npm run prisma:seed
- npm run dev

Melhorias Realizadas:
Criação de um arquivo OrderService.ts que funciona como um cozinheiro, ele que prepara todas as informações (valida, paga, salva, notifica), através dos dados que o corpo da requisição recebe e envia para ele pelo arquivo de OrderController.ts.
O OrderController funciona como um garçom, ele apenas chama o OrderService, envia os dados da requisição para ele, e por fim, envia uma resposta. Desta maneira, o OrderController não fica responsável por todo o código
e fazemos a separação de responsabilidades(SRP) e camadas.
Além disso, também adicionamos o princípio OCP para o pagamento, ou seja, caso seja necessário adicionar ou remover alguma forma de pagamento, não é necessário mexer no código principal, o que poderia causar erros e
deixar o sistema com problemas. Anteriormente a verificação do método de pagamento era feita com if/else, agora a forma de pagamento é transformada em uma classe, para depois, calcular o frete, cada classe tem seu 
método que calcula o frete específico para o tipo de produto. Além disso, o cálculo de preço e de estoque foram separados para não haver mistura na regra de negócio.
