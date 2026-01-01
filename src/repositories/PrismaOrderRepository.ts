import { PrismaClient } from '@prisma/client';
import { IOrderRepository } from './IOrderRepository';

export class PrismaOrderRepository implements IOrderRepository{
    private prisma = new PrismaClient();

    async createOrder(customer: any, items: any, total: number, status: string): Promise<void> {
        await this.prisma.order.create({
            data: {
                customer,
                items,
                total,
                status
            },
        });
    }
}
