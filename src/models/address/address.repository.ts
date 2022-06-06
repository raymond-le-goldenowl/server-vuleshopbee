import { Address } from './entities/address.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Address)
export class AddressRepository extends Repository<Address> {}
