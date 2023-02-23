import { Module } from '@nestjs/common';
import { ProductAccountsService } from './product_accounts.service';
import { ProductAccountsController } from './product_accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAccountsRepository } from './product_accounts.repositoty';
import { ProductsModule } from 'src/models/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductAccountsRepository]),
    ProductsModule,
  ],
  controllers: [ProductAccountsController],
  providers: [ProductAccountsService],
  exports: [ProductAccountsService],
})
export class ProductAccountsModule {}
