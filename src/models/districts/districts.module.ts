import { DistrictsRepository } from './districts.repository';
import { Module } from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { DistrictsController } from './districts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DistrictsRepository])],
  controllers: [DistrictsController],
  providers: [DistrictsService],
})
export class DistrictsModule {}
