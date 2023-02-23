import { EntityRepository, Repository } from 'typeorm';

import { Banner } from './entities/banner.entity';

@EntityRepository(Banner)
export class BannersRepository extends Repository<Banner> {}
