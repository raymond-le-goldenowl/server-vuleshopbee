import { EntityRepository, Repository } from 'typeorm';

import { Floating } from './entities/floating.entity';

@EntityRepository(Floating)
export class FloatingRepository extends Repository<Floating> {}
