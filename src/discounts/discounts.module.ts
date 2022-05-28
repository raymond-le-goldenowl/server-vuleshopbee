import { DiscountsRepository } from './discounts.repository';
import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountsRepository])],
  controllers: [DiscountsController],
  providers: [DiscountsService],
})
export class DiscountsModule {}
