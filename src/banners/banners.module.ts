import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { BannersRepository } from './banners.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BannersRepository])],
  controllers: [BannersController],
  providers: [BannersService],
})
export class BannersModule {}
