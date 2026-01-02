// Não cobra frete
import { Product } from "./IProduct";

export class DigitalProduct implements Product{
    public frete = 0;
    constructor(id: number, name: string, price: number) {}

    calculateFreight(): number {
        return this.frete;
    }
}