import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsRepository } from './tags.repository';
import { ProductTagModule } from 'src/models/product_tag/product_tag.module';
import { ProductsModule } from 'src/models/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TagsRepository]),
    ProductsModule,
    ProductTagModule,
  ],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
