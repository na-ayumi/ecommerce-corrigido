export interface IProductRepository {
    findProduct(productId: number): Promise<any  | null>;
}