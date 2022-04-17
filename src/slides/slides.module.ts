import { Module } from '@nestjs/common';
import { SlidesService } from './slides.service';
import { SlidesController } from './slides.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlidesRepository } from './slides.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SlidesRepository])],
  controllers: [SlidesController],
  providers: [SlidesService],
})
export class SlidesModule {}
