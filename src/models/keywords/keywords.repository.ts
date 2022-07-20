import { EntityRepository, Repository } from 'typeorm';

import { Keyword } from './entities/keyword.entity';

@EntityRepository(Keyword)
export class KeywordsRepository extends Repository<Keyword> {}
