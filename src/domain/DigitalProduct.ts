// Não cobra frete
import { Product } from "./IProduct";

export class DigitalProduct implements Product{
    constructor(id: number, name: string, price: number) {}

    calculateFreight(total: number): number {
        return total;
    }
}