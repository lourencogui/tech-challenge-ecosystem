import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { take } from 'rxjs';
import { Repository } from 'typeorm';
import { AppEntity } from './entities/app.entity';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(AppEntity) private repo: Repository<AppEntity>,
    private httpService: HttpService
  ) { }

  async generateToken(access_code: string) {
    const { data } = await this.httpService.post('https://www.nuvemshop.com.br/apps/authorize/token', {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: access_code
    }).pipe(take(1)).toPromise();

    const token = data.access_token;
    const user_id = data.user_id;

    if (!(token && user_id)) {
      throw new BadRequestException(data.error_description);
    }

    const appToken = this.repo.create({ user_id, token });
    this.repo.save(appToken);
    return { user_id }
  }
}
