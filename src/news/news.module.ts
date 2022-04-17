import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { NewsRepository } from './news.repository';

@Module({
  imports: [TypeOrmModule.forFeature([NewsRepository])],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
