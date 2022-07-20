import { Ward } from './entities/ward.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Ward)
export class WardsRepository extends Repository<Ward> {}
