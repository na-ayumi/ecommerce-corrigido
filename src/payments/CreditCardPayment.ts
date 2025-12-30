import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';

export class CreditCardPayment implements IPaymentMethod {
    

    process(): void {
        logger.info(`Processando cartão final ${paymentDetails.cardNumber.slice(-4)}`);
        // Simulação de gateway
        if (paymentDetails.cvv === '000') throw new Error('Cartão recusado');
    }
}