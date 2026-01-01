export interface IOrderRepository {
    createOrder(customer: any, items: any, total: number, status: string): Promise <void>;
}