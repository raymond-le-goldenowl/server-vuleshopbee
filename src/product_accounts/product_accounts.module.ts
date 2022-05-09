import { Module } from '@nestjs/common';
import { ProductAccountsService } from './product_accounts.service';
import { ProductAccountsController } from './product_accounts.controller';

@Module({
  controllers: [ProductAccountsController],
  providers: [ProductAccountsService],
})
export class ProductAccountsModule {}
