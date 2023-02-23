import { GendersRepository } from './genders.repository';
import { Module } from '@nestjs/common';
import { GendersService } from './genders.service';
import { GendersController } from './genders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([GendersRepository])],
  controllers: [GendersController],
  providers: [GendersService],
})
export class GendersModule {}
