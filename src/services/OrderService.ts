//Fluxo do pedido (Valida -> Paga -> Salva -> Notifica)
import { ProductFactory } from "../domain/ProductFactory";
import { OrderController } from "../controllers/OrderController";
import { Product } from "@prisma/client";
import logger from '../lib/logger';
import { PrismaClient } from '@prisma/client';
import { PaymentFactory } from '../payments/PaymentFactory';
import { IPaymentMethod } from '../payments/IPaymentMethod';
import { getMailClient } from '../lib/mail';
import { EtherealMailProvider } from "../providers/EtherealMailProvider";
import { NotificationService } from "../services/NotificationService";

const prisma = new PrismaClient();

export class OrderService {
    //Validação 
    validateReq(itens: any){
        if(!itens || itens.length === 0){
            logger.error('Tentativa de pedido sem itens');
            const error = new Error("Carrinho vazio");
            (error as any).statusCode = 400;
            throw error;
        }
    }

    //Cálculo de Estoque
    async CalculateStock(itens: any): Promise<any[]> {
        const products: any[] = []
        for(const item of itens){
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
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
        for(const item of itens){
            //for(const product of products){
                totalAmount+= products[item].price * item.quantity
                totalAmount+= ProductFactory.createProduct(products).calculateFreight()
            //}
            productsDetails.push({ ...products, quantity: item.quantity });
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
        let [totalAmount] = await this.CalculatePrice(data)
        const order = await prisma.order.create({
            data: {
                customer: data.customer,
                items: JSON.stringify(data.productsDetails),
                total: totalAmount,
                status: 'confirmed'
            }
      });
      return order;
    }

    async Notification(data: any, ) {
        let [totalAmount] = await this.CalculatePrice(data)
        let [, productsDetails] = await this.CalculatePrice(data)
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
    }

    async executeOrderService(data: any) {
        this.validateReq(data.items)
        this.CalculateStock(data.items)
        this.CalculatePrice(data.items)
        this.PaymentProcess(data.paymentMethod, data.paymentDetails)
        this.OrderCreate(data)
        this.Notification(data)
    }

}




// const product = ProductFactory.createProduct(productDataFromDB);
// const freight = product.calculateFreight();