import { Module } from '@nestjs/common';
import { ProductTagService } from './product_tag.service';
import { ProductTagController } from './product_tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTagRepository } from './product_tag.repository';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductTagRepository]), ProductsModule],
  controllers: [ProductTagController],
  providers: [ProductTagService],
  exports: [ProductTagService],
})
export class ProductTagModule {}
