import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersRepository } from './suppliers.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SuppliersRepository])],
  controllers: [SuppliersController],
  providers: [SuppliersService],
})
export class SuppliersModule {}
