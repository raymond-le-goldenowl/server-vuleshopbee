import { Module } from '@nestjs/common';
import { FloatingService } from './floating.service';
import { FloatingController } from './floating.controller';
import { Floating } from './entities/floating.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Floating])],
  controllers: [FloatingController],
  providers: [FloatingService],
})
export class FloatingModule {}
