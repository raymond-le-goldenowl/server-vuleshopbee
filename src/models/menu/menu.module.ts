import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { MenuRepository } from './menu.repository';
import { CategoriesRepository } from 'src/models/categories/categories.repository';
import { CategoriesService } from 'src/models/categories/categories.service';
import { CategoriesModule } from 'src/models/categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([MenuRepository]), CategoriesModule],
  controllers: [MenuController],

  providers: [MenuService],
})
export class MenuModule {}
