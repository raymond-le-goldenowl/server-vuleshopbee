import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { Promotion } from './entities/promotion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion])],
  controllers: [PromotionController],
  providers: [PromotionService],
})
export class PromotionModule {}
