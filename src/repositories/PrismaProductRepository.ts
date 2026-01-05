import { PrismaClient } from "@prisma/client";
import { IProductRepository } from "./IProductRepository";

export class PrismaProductRepository implements IProductRepository {
    private prisma = new PrismaClient;

    async findProduct(productId: number): Promise<any | null> {
        return this.prisma.product.findUnique({
            where: {id: productId}
        });
    }
}