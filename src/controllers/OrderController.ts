//(HTTP) Recebe request, chama OrderService, devolve response.

import { Request, Response } from 'express';
import { IPaymentMethod } from '../payments/IPaymentMethod';
import { PrismaClient } from '@prisma/client';
import { getMailClient } from '../lib/mail';
import logger from '../lib/logger';
import { PaymentFactory } from '../payments/PaymentFactory';
import { EtherealMailProvider } from "../providers/EtherealMailProvider";
import { NotificationService } from "../services/NotificationService";
import { ProductFactory } from '../domain/ProductFactory';
import {  OrderService } from '../services/OrderService';

const prisma = new PrismaClient();
const orderService = new OrderService();

export class OrderController {
  
  // Método Gigante: Violação de SRP
  async processOrder(req: Request, res: Response) {
    try {
      const { customer, items, paymentMethod, paymentDetails } = req.body;

      await orderService.executeOrderService(req.body)

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