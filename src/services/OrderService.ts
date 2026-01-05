import { ProductFactory } from "../domain/ProductFactory";
import logger from '../lib/logger';
import { PaymentFactory } from '../payments/PaymentFactory';
import { getMailClient } from '../lib/mail';
import { EtherealMailProvider } from "../providers/EtherealMailProvider";
import { NotificationService } from "../services/NotificationService";
import { IOrderRepository } from "../repositories/IOrderRepository";
import { IProductRepository } from "../repositories/IProductRepository";


export class OrderService {
    constructor(
        private orderRepository: IOrderRepository,
        private productRepository: IProductRepository
    ) {};

    //Validação 
    validateReq(itens: any){
        for(const item of itens){
            if(!itens || itens.length === 0 || item.quantity === 0){
                logger.error('Tentativa de pedido sem itens');
                const error = new Error("Carrinho vazio");
                (error as any).statusCode = 400;
                throw error;
            }
        }
    }

    //Cálculo de Estoque
    async CalculateStock(itens: any): Promise<any[]> {
        const products: any[] = []
        for(const item of itens){
            const product = await this.productRepository.findProduct(item.productId);
            
            if (!product){
                const error = new Error(`Produto ${item.productId} não encontrado`);
                (error as any).statusCode = 400;
                throw error;
            }
            products.push(product)
        }
        return products
    }

    //Cálculo de Preço
    async CalculatePrice(itens: any): Promise<[number, any[]]> {
        let totalAmount = 0;
        let productsDetails = [];
        const products = await this.CalculateStock(itens)
        for(let i=0; i<itens.length; i++){
            const item = itens[i]
            const productDataFromDB = products[i]

            const product = ProductFactory.createProduct(productDataFromDB);
            const freight = product.calculateFreight();
            totalAmount+= (productDataFromDB.price * item.quantity) + freight
            //}
            productsDetails.push({ ...productDataFromDB, quantity: item.quantity });
        }
        return [totalAmount, productsDetails];
    }

    // Processamento de Pagamento (OCP)
    PaymentProcess(paymentMethod: any, paymentDetails: any) {
        const payment = PaymentFactory.getPaymentMethod(paymentMethod)
    
        if(payment) {
            payment.process(paymentDetails)
        } else {
            const error = new Error('Método de pagamento não suportado');
            (error as any).statusCode = 400;
            throw error;
        }
    }

    async OrderCreate(data: any): Promise<any> {
        let [totalAmount, productsDetails] = await this.CalculatePrice(data.items)
        
        const order = await this.orderRepository.createOrder(
            data.customer,
            JSON.stringify(productsDetails),
            totalAmount,
            'confirmed'
        );

        return order;
    }

    async Notification(data: any): Promise<string | false> {
        let [totalAmount] = await this.CalculatePrice(data.items)
        let [, productsDetails] = await this.CalculatePrice(data.items)
        let order = await this.OrderCreate(data)
        let customer = data.customer
        const mailer = await getMailClient();

        const mailProvider = new EtherealMailProvider(mailer);
        const notificationService = new NotificationService(mailProvider);

        const emailPreview = notificationService.messageEmail(
            customer ,
            order.id,
            totalAmount,
            productsDetails
        )

        return emailPreview
    }

    async executeOrderService(data: any): Promise<[any, any]> {
        this.validateReq(data.items)
        this.CalculateStock(data.items)
        this.CalculatePrice(data.items)
        this.PaymentProcess(data.paymentMethod, data.paymentDetails)
        let order = await this.OrderCreate(data)
        let emailPreview = await this.Notification(data)

        return[order, emailPreview]
    }
}