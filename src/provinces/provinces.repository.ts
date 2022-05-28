import { Province } from './entities/province.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Province)
export class ProvincesRepository extends Repository<Province> {}
