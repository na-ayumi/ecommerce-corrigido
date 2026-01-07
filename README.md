<<<<<<< HEAD
## Instalação e Configuração
1.  **Clone o código do GitHub:**
    ```bash
    git clone 'URL'
    ```


2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Crie o banco de dados (SQLite) e as tabelas:**
    ```bash
    npm run prisma:migrate
    ```

4.  **Popule o banco com dados de teste (Livro Físico e E-book):**
    ```bash
    npm run prisma:seed
    ```

## Execução

Para rodar a API em modo de desenvolvimento (reinicia ao salvar arquivos):

```bash
npm run dev
```

O servidor iniciará em `http://localhost:3000`.

## Como Testar

Utilize o **cURL** (terminal) ou ferramentas como **Postman/Insomnia** para enviar requisições POST.



### Cenário 1: Compra de Livro Físico (Com Frete)
O sistema deve calcular R$ 10,00 de frete.

```bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{
  "customer": "abacaxi123@ethereal.email",
  "items": [{ "productId": 1, "quantity": 1 }],
  "paymentMethod": "credit_card",
  "paymentDetails": { "cardNumber": "1234567812345678", "cvv": "123" }
}'
```

### Cenário 2: Compra de E-book (Digital, Sem Frete)

```bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{
  "customer": "abacate123@ethereal.email",
  "items": [{ "productId": 2, "quantity": 1 }],
  "paymentMethod": "pix",
  "paymentDetails": { "cpf": "12345678900" }
}'
```

---

## Melhorias Implementadas
O objetivo das melhorias foi separar as responsabilidades e diminuir o acoplamento entre as camadas do sistema.

### Separação de Responsabilidades (SRP) e Inversão de Dependência (DIP)

Isolamos a regra de negócio, impedindo que a camada de `service` tenha contato direto com o **Prisma**. Isso foi feito através da criação de interfaces:

- **IOrderRepository:** para a criação das ordens de pedido.
- **IProductRepository:** para localizar os produtos no banco de dados.
- **Encapsulamento:** O uso do Prisma ficou restrito às implementações `PrismaOrderRepository` e `PrismaProductRepository`.

Além disso, removemos a dependência de ferramentas externas da regra de negócio:

- Criação da interface **IMailProvider**.
- Implementação do **EtherealMailProvider**.
- Criação do **NotificationService**, responsável pela construção das mensagens.

### Extensibilidade (OCP)

Para que o sistema suporte novos métodos de pagamento sem a necessidade de alterar o código existente, utilizamos:

- Interface **IPaymentMethod** com o método `process()`.
- Implementações concretas: `CreditCardPayment` e `PixPayment`.
- Uso de uma **PaymentFactory** para instanciar o método correto em tempo de execução.

### Hierarquia de Produtos (LSP)

Aplicamos o Princípio de Substituição de Liskov para garantir que as subclasses de produtos se comportem corretamente:

- Criação de uma abstração **Product** com o método `calculateFreight()`.
- **PhysicalProduct:** implementa a lógica de cobrança de frete.
- **DigitalProduct:** retorna frete zero, mantendo a consistência do contrato.
- Uso de uma **ProductFactory** para converter os dados do banco em objetos de domínio ricos.

