import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannersRepository } from './banners.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BannersRepository])],
  controllers: [BannersController],
  providers: [BannersService],
})
export class BannersModule {}
