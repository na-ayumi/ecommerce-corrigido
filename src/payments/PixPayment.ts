import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';

export class PixPayment implements IPaymentMethod {
    process(paymentDetails: any): void {
        logger.info(`Processando pix com CPF final ${paymentDetails.cpf.slice(-3)}`);
        if (paymentDetails.cpf.length < 11) throw new Error('CPF Inválido');
    }
}