import { Product } from "./product.entity";

export interface Order {
    id: string;
    total: number;
    created_at: string;
    products: Array<Product>
}