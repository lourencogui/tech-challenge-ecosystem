import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // function to be executed when client accesss
  // https://www.nuvemshop.com.br/apps/3639/authorize?state=csrf-code
  @Get()
  async generateToken(@Query('code') code: string) {
    return await this.appService.generateToken(code);
  }
}
