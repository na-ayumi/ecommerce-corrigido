import { Request, Response } from 'express';
import { IPaymentMethod } from '../payments/IPaymentMethod';
import { PrismaClient } from '@prisma/client';
import { getMailClient } from '../lib/mail';
import logger from '../lib/logger';
import { PaymentFactory } from '../payments/PaymentFactory';
import { EtherealMailProvider } from "../providers/EtherealMailProvider";
import { NotificationService } from "../services/NotificationService";
import { ProductFactory } from '../domain/ProductFactory';
import { Product } from '../domain/IProduct';

const prisma = new PrismaClient();

// Lembram do God Class q falamos em aula? Este é um exemplo
export class OrderController {
  
  // Método Gigante: Violação de SRP
  async processOrder(req: Request, res: Response) {
    try {
      const { customer, items, paymentMethod, paymentDetails } = req.body;

      // 1. VALIDAÇÃO (Deveria estar em outro lugar)
      if (!items || items.length === 0) {
        logger.error('Tentativa de pedido sem itens');
        return res.status(400).json({ error: 'Carrinho vazio' });
      }

      // 2. CÁLCULO DE PREÇO E ESTOQUE (Regra de Negócio Misturada)
      let totalAmount = 0;
      let productsDetails = [];

      for (const item of items) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        
        if (!product) {
          return res.status(400).json({ error: `Produto ${item.productId} não encontrado` });
        }

        // Violação de LSP e OCP: 
        // Lógica condicional baseada em "tipo" (String).
        // Se adicionarmos "Serviço" ou "Assinatura", teremos que mexer aqui.
        totalAmount+= product.price * item.quantity
        totalAmount = ProductFactory.createProduct(product).calculateFreight(totalAmount)
        
        productsDetails.push({ ...product, quantity: item.quantity });
      }

      // 3. PROCESSAMENTO DE PAGAMENTO (OCP)
      const payment = PaymentFactory.getPaymentMethod(paymentMethod)

      if(payment) {
        payment.process(paymentDetails)
      } else {
        return res.status(400).json({ error: 'Método de pagamento não suportado' });
      }

      // 4. PERSISTÊNCIA (Violação de SRP - Controller acessando Banco) 
      const order = await prisma.order.create({
        data: {
          customer,
          items: JSON.stringify(productsDetails),
          total: totalAmount,
          status: 'confirmed'
        }
      });

      // 5. NOTIFICAÇÃO (Violação de SRP - Efeitos colaterais no Controller) 
      const mailer = await getMailClient();

      const mailProvider = new EtherealMailProvider(mailer);
      const notificationService = new NotificationService(mailProvider);

      const emailPreview = notificationService.messageEmail(
        customer,
        order.id,
        totalAmount,
        productsDetails
      )

      return res.json({ 
        message: 'Pedido processado com sucesso', 
        orderId: order.id,
        emailPreview // Retorna o link na API para facilitar
      });

    } catch (error: any) {
      logger.error(`Erro ao processar pedido: ${error.message}`);
      return res.status(500).json({ error: 'Erro interno' });
    }
  }
}