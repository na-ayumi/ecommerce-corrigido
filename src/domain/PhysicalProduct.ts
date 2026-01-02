// Cobra frete
import { Product } from "./IProduct";

export class PhysicalProduct implements Product{
    public frete = 10;
    constructor(id: number, name: string, price: number, weight: number, dimensions: string) {}

    calculateFreight(): number {
        return this.frete;
    }
}