import { Gender } from './entities/gender.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Gender)
export class GendersRepository extends Repository<Gender> {}
