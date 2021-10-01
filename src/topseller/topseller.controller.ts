import { Controller, Get, Param, Query } from '@nestjs/common';
import { TopSellerService } from './topseller.service';

@Controller('topseller')
export class TopSellerController {

    constructor(private topSellerService: TopSellerService) { }

    @Get()
    getTopSellerProduct(@Query('user_id') user_id: string) {
        return this.topSellerService.getTopSellerProduct(parseInt(user_id));
    }

    @Get(':season')
    getTopSellerProductFromSeason(
        @Query('user_id') user_id: string,
        @Param('season') season: string
    ) {
        return this.topSellerService.getTopSellerProductFromSeason(parseInt(user_id), season);
    }
}
