import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsModule } from 'src/products/products.module';
import { GuaranteePolicyService } from './guarantee_policy.service';
import { GuaranteePolicyController } from './guarantee_policy.controller';
import { GuaranteePolicyRepository } from './guarantee_policy.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([GuaranteePolicyRepository]),
    ProductsModule,
  ],
  controllers: [GuaranteePolicyController],
  providers: [GuaranteePolicyService],
})
export class GuaranteePolicyModule {}
