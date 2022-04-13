import { Supplier } from 'src/suppliers/entities/supplier.entity';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SuppliersRepository } from './suppliers.repository';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(SuppliersRepository)
    private suppliersRepository: SuppliersRepository,
  ) {}

  async create(image, createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const { name, address, email, citizen_identity, verify } =
      createSupplierDto;

    const saved = await this.suppliersRepository.save({
      name,
      address,
      email,
      image: image?.filename,
      citizen_identity,
      verify,
    });

    if (!saved) {
      throw new BadRequestException();
    }

    return saved;
  }

  async findAll(withDeleted: boolean): Promise<Supplier[]> {
    let suppliers: Supplier[];

    if (withDeleted) {
      suppliers = await this.suppliersRepository.find({ withDeleted: true });
    } else {
      suppliers = await this.suppliersRepository.find();
    }

    return suppliers;
  }

  async findOne(id: string, withDeleted: boolean): Promise<Supplier> {
    let supplier: Supplier;

    if (withDeleted) {
      supplier = await this.suppliersRepository.findOne({
        where: { id },
        withDeleted: true,
      });
    } else {
      supplier = await this.suppliersRepository.findOne(id);
    }

    if (!supplier) {
      throw new NotFoundException();
    }

    return supplier;
  }

  async update(image, id: string, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.findOne(id, true);

    if (!supplier) {
      throw new NotFoundException();
    }

    supplier.name = updateSupplierDto.name;
    supplier.email = updateSupplierDto.email;
    supplier.image = image?.filename || supplier.image;
    supplier.verify = updateSupplierDto.verify;
    supplier.address = updateSupplierDto.address;
    supplier.citizen_identity = updateSupplierDto.citizen_identity;

    const saved = await this.suppliersRepository.save(supplier);

    return saved;
  }

  async remove(id: string, remove: boolean) {
    const supplier: Supplier = await this.findOne(id, true);
    if (remove) {
      await this.suppliersRepository.delete(supplier.citizen_identity);
    } else {
      await this.suppliersRepository.softDelete(supplier.id);
    }
  }
}
