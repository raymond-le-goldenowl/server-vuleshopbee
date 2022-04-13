import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';
import { TagsRepository } from './tags.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TagsRepository]), ProductsModule],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
