import { District } from './entities/district.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(District)
export class DistrictsRepository extends Repository<District> {}
