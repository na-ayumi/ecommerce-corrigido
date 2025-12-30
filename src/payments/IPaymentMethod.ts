export interface IPaymentMethod{
    process(paymentDetails: any): void;
}