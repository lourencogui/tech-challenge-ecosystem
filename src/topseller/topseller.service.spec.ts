import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { AppEntity } from '../entities/app.entity';
import { TopSellerController } from '../topseller/topseller.controller';
import { TopSellerService } from '../topseller/topseller.service';

describe('TopSellerService', () => {
  let service: TopSellerService;

  const data = [
    {
      // autumn
      created_at: '2021-03-07T21:11:39+0000',
      products: [
        {
          product_id: 2,
          name: 'product 2',
          price: 49.9
        },
        {
          product_id: 2,
          name: 'product 2',
          price: 49.9
        },
        {
          product_id: 3,
          name: 'product 3',
          price: 99.9
        }
      ]
    },
    {
      // winter
      created_at: '2021-07-04T09:17:03+0000',
      products: [
        {
          product_id: 4,
          name: 'product 4',
          price: 19.9
        }
      ]
    },
    {
      // spring
      created_at: '2021-09-29T11:13:15+0000',
      products: [
        {
          product_id: 1,
          name: 'product 1',
          price: 119.9
        },
        {
          product_id: 1,
          name: 'product 1',
          price: 119.9
        },
        {
          product_id: 2,
          name: 'product 2',
          price: 49.9
        },
      ]
    },
    {
      // summer
      created_at: '2021-12-15T17:20:18+0000',
      products: [
        {
          product_id: 1,
          name: 'product 1',
          price: 119.9
        },
        {
          product_id: 3,
          name: 'product 3',
          price: 99.9
        },
        {
          product_id: 3,
          name: 'product 3',
          price: 99.9
        },
        {
          product_id: 3,
          name: 'product 3',
          price: 99.9
        }
      ]
    },
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopSellerController],
      providers: [
        TopSellerService, 
        {
          provide: getRepositoryToken(AppEntity),
          useValue: {
            findOne: jest.fn(() => {
              return Promise.resolve({
                user_id: 1,
                token: 'mockToken'
              })
            })
          }
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(() => {
              return {
                pipe: () => {
                  return {
                    toPromise: () => {
                      return Promise.resolve({
                        data: data
                      });
                    }
                  }
                }
              }
            })
          }
        }
      ],
      imports: [HttpModule]
    }).compile();

    service = module.get<TopSellerService>(TopSellerService);
  });

  it('should get the seasons right', () => {
    let season = service.getSeason(new Date(2021, 1, 18));
    expect(season).toBe('summer');

    season = service.getSeason(new Date(2021, 3, 1));
    expect(season).toBe('autumn');

    season = service.getSeason(new Date(2021, 5, 15));
    expect(season).toBe('winter');

    season = service.getSeason(new Date(2021, 9, 31));
    expect(season).toBe('spring');
  });

  it('get the most selled product from array', () => {
    const products: Array<Product> = [
      {product_id: 1, name: 'Product 1', price: 34.99},
      {product_id: 2, name: 'Product 2', price: 19.99},
      {product_id: 3, name: 'Product 3', price: 99.99},
      {product_id: 1, name: 'Product 1', price: 34.99}
    ]
    const mostSelledProduct = service.getTopSellerProductFromList(products);
    expect(mostSelledProduct).toBeDefined();
    expect(mostSelledProduct.numberOfSales).toBe(2);
    expect(mostSelledProduct.topSellerProduct).toMatchObject({
      product_id: 1,
      name: 'Product 1',
      price: 34.99
    });
  });

  it('get all orders from mock httpService', async () => {
    const orders = await service.getAllOrders(1);
    expect(orders).toBeDefined();
    expect(orders).toMatchObject(data);
  });

});