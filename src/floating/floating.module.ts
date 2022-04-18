import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FloatingService } from './floating.service';
import { FloatingController } from './floating.controller';
import { FloatingRepository } from './floating.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FloatingRepository])],
  controllers: [FloatingController],
  providers: [FloatingService],
})
export class FloatingModule {}
