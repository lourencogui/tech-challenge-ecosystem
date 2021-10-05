import { BadRequestException } from "@nestjs/common";

export class Product {
    product_id: number;
    name: string;
    price: number;

    constructor(obj) {
        const fields = ['product_id', 'name', 'price'];
        const keys = Object.keys(obj);
        if (!fields.every(val => keys.includes(val))) {
            throw new BadRequestException('missing keys in product');
        }
        this.product_id = obj.product_id;
        this.name = obj.name;
        this.price = obj.price;
    }
}