import { EntityRepository, Repository } from 'typeorm';

import { Slide } from './entities/slide.entity';

@EntityRepository(Slide)
export class SlidesRepository extends Repository<Slide> {}
