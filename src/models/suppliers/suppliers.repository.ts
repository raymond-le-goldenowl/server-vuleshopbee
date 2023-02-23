import { EntityRepository, Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';

@EntityRepository(Supplier)
export class SuppliersRepository extends Repository<Supplier> {}
