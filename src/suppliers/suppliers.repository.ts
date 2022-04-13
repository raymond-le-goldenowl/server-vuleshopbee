import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Supplier)
export class SuppliersRepository extends Repository<Supplier> {}
