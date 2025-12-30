import { IPaymentMethod } from '../payments/IPaymentMethod';
import { CreditCardPayment } from '../payments/CreditCardPayment';
import { PixPayment } from '../payments/PixPayment';

export class PaymentFactory {
    private static paymentMethods: Record<string, IPaymentMethod> = {
        "credit_card": new CreditCardPayment(),
        "pix": new PixPayment()
    }

    static getPaymentMethod(type: string): IPaymentMethod | undefined {
        return this.paymentMethods[type];
    }
}