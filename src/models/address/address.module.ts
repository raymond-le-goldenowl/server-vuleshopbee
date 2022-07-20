import { AddressRepository } from './address.repository';
import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AddressRepository])],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
