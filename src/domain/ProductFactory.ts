import { Product } from './IProduct';
import { PhysicalProduct } from './PhysicalProduct';
import { DigitalProduct } from './DigitalProduct';
export class ProductFactory {
  static createProduct(data: any): Product {
    if (data.type === 'physical') {
      return new PhysicalProduct(data.id, data.name, data.price, data.weight, data.dimensions);
    } else if (data.type === 'digital') {
      return new DigitalProduct(data.id, data.name, data.price);
    }
    throw new Error('Unknown product type');
  }
}