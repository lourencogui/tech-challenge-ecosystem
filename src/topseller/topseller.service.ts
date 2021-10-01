import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { take } from 'rxjs';
import { AppEntity } from './../entities/app.entity';
import { Product } from './../entities/product.entity';
import { Repository } from 'typeorm';

type Season = 'winter' | 'spring' | 'summer' | 'autumn';

const isSeason = (season: string): boolean => {
    switch(season) {
        case 'winter':
        case 'spring':
        case 'summer':
        case 'autumn':
            return true;
        default:
            return false;
    }
}

@Injectable()
export class TopSellerService {

    constructor(
        @InjectRepository(AppEntity) private repo: Repository<AppEntity>,
        private httpService: HttpService
    ) { }

    getSeason = (date: Date): Season => {
        // considering the south hemisphere
        const autumn = [
            new Date(date.getFullYear(), 2, 1).getTime(), 
            new Date(date.getFullYear(), 4, 31).getTime()
        ];
        const winter = [
            new Date(date.getFullYear(), 5, 1).getTime(), 
            new Date(date.getFullYear(), 7, 31).getTime()
        ];
        const spring = [
            new Date(date.getFullYear(), 8, 1).getTime(), 
            new Date(date.getFullYear(), 10, 31).getTime()
        ];
    
        if (date.getTime() >= autumn[0] && date.getTime() <= autumn[1]) return 'autumn';
        if (date.getTime() >= winter[0] && date.getTime() <= winter[1]) return 'winter';
        if (date.getTime() >= spring[0] && date.getTime() <= spring[1]) return 'spring';
    
        return 'summer';
    }

    async getAllOrders(user_id: number) {
        const user = await this.repo.findOne(user_id);
        if (!user) {
            throw new NotFoundException(`user not found`);
        }

        // lets get all the orders from the store!
        const headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Seasons (teste@teste.com)',
            'Authentication': `bearer ${user.token}`
        };

        const fields = [
            'created_at',
            'products'
        ]

        const { data } = await this.httpService.get(
            `${process.env.API_ENDPOINT}/${user_id}/orders?fields=${fields.join(',')}`, {
            headers: headers
        }).pipe(take(1)).toPromise();

        return data;
    }

    async getAllProducts(user_id: number) {
        const orders = await this.getAllOrders(user_id);
        let products: Array<Product> = [];

        orders.map(order => {
            products.push(...order.products);
        });

        return products;
    }

    async getAllProductsFromSeason(user_id: number, season: string) {
        if (!isSeason(season)) {
            throw new BadRequestException(`${season} is not a valid season`);
        }
        const orders = await this.getAllOrders(user_id);
        let products: Array<Product> = [];
        // for each order from that store
        orders.map(order => {
            const date = new Date(order.created_at);
            const orderSeason = this.getSeason(date);
            // if the order is from the requested season, fetch all products from it
            if (season === orderSeason) {
                products.push(...order.products);
            }
        });

        return products;
    }

    getTopSellerProductFromList(products: Array<Product>) {
        if (!products.length) return { topSellerProduct: null, numberOfSales: 0 };
        let topSellerProduct: Product;
        let soldProducts: object = { };

        products.map(product => {
            if (soldProducts[product.product_id]) {
                soldProducts[product.product_id]++;
            } else {
                soldProducts[product.product_id] = 1;
            }
        });
        const topSeller = Object.entries(soldProducts).sort(([,a], [,b]) => b-a)[0];
        topSellerProduct = products.find((product) => product.product_id === parseInt(topSeller[0]));
        topSellerProduct = {
            product_id: topSellerProduct.product_id,
            name: topSellerProduct.name,
            price: topSellerProduct.price
        }

        return { topSellerProduct, numberOfSales: topSeller[1] };
    }

    async getTopSellerProduct(user_id: number) {
        const products = await this.getAllProducts(user_id);
        return this.getTopSellerProductFromList(products);
    }

    async getTopSellerProductFromSeason(user_id: number, season: string) {
        const products = await this.getAllProductsFromSeason(user_id, season);
        return this.getTopSellerProductFromList(products);
    }
}
