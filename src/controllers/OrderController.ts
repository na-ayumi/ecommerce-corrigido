import { Request, Response } from 'express';
import logger from '../lib/logger';
import {  OrderService } from '../services/OrderService';
import { PrismaOrderRepository } from '../repositories/PrismaOrderRepository';
import { PrismaProductRepository } from '../repositories/PrismaProductRepository';

const orderRepository = new PrismaOrderRepository();
const productRepository = new PrismaProductRepository();

const orderService = new OrderService(orderRepository, productRepository);

export class OrderController {
  
  // Método Gigante: Violação de SRP
  async processOrder(req: Request, res: Response) {
    try {
      const { customer, items, paymentMethod, paymentDetails } = req.body;

      let [order, emailPreview] = await orderService.executeOrderService(req.body);

      return res.json({ 
        message: 'Pedido processado com sucesso', 
        orderId: order.id,
        emailPreview // Retorna o link na API para facilitar
      });

    } catch (error: any) {
      const status = error.statusCode || 500

      logger.error(`Erro ao processar pedido: ${error.message}`);
      return res.status(status).json({ error: error.message || 'Erro interno' })
    }
  }
}