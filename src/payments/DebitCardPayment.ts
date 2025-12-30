import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';
import { OrderController } from '../controllers/OrderController';

const paymentDetailsExport = new OrderController().getPaymentDetails

export class DebitCardPayment implements IPaymentMethod {
    process(): void {
        logger.info(`Processando débito ${paymentDetailsExport.cardNumber.slice(-4)}`);
        if (paymentDetailsExport.cvv === '000') throw new Error('Cartão recusado');
    }
}