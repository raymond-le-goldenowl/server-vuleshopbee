import { Module } from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { DistrictsController } from './districts.controller';
import { District } from './entities/district.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([District])],
  controllers: [DistrictsController],
  providers: [DistrictsService],
})
export class DistrictsModule {}
