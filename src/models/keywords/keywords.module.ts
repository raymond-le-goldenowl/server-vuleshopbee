import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KeywordsService } from './keywords.service';
import { KeywordsController } from './keywords.controller';
import { KeywordsRepository } from './keywords.repository';

@Module({
  imports: [TypeOrmModule.forFeature([KeywordsRepository])],
  controllers: [KeywordsController],
  providers: [KeywordsService],
})
export class KeywordsModule {}
