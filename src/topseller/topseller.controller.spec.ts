import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppEntity } from '../entities/app.entity';
import { TopSellerController } from './topseller.controller';
import { TopSellerService } from './topseller.service';

describe('TopSellerController', () => {
  let controller: TopSellerController;
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
                toPromise: () => {
                  return Promise.resolve({
                    data: data
                  });
                }
              }
            })
          }
        }
      ]
    }).compile();

    controller = module.get<TopSellerController>(TopSellerController);
  });

  
  it('get top seller product of all seasons', async () => {
    const response = await controller.getTopSellerProduct('1');
    expect(response).toBeDefined();
    expect(response.numberOfSales).toBe(4);
    expect(response.topSellerProduct).toMatchObject({
      product_id: 3,
      name: 'product 3',
      price: 99.9
    });
  });

  it('get top seller product from autumn', async () => {
    const response = await controller.getTopSellerProductFromSeason('1', 'autumn');
    expect(response).toBeDefined();
    expect(response.numberOfSales).toBe(2);
    expect(response.topSellerProduct).toMatchObject({
      product_id: 2,
      name: 'product 2',
      price: 49.9
    });
  });

  it('get top seller product from winter', async () => {
    const response = await controller.getTopSellerProductFromSeason('1', 'winter');
    expect(response).toBeDefined();
    expect(response.numberOfSales).toBe(1);
    expect(response.topSellerProduct).toMatchObject({
      product_id: 4,
      name: 'product 4',
      price: 19.9
    });
  });

  it('get top seller product from spring', async () => {
    const response = await controller.getTopSellerProductFromSeason('1', 'spring');
    expect(response).toBeDefined();
    expect(response.numberOfSales).toBe(2);
    expect(response.topSellerProduct).toMatchObject({
      product_id: 1,
      name: 'product 1',
      price: 119.9
    });
  });

  it('get top seller product from summer', async () => {
    const response = await controller.getTopSellerProductFromSeason('1', 'summer');
    expect(response).toBeDefined();
    expect(response.numberOfSales).toBe(3);
    expect(response.topSellerProduct).toMatchObject({
      product_id: 3,
      name: 'product 3',
      price: 99.9
    });
  });

});
