import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';
import { OrderController } from '../controllers/OrderController';

const paymentDetailsExport = new OrderController().getPaymentDetails

export class CreditCardPayment implements IPaymentMethod {
    process(): void {
        logger.info(`Processando pix`);
    }
}