import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsController } from './carts.controller';
import { CartsRepository } from './carts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CartsRepository])],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
