import { EntityRepository, Repository } from 'typeorm';

import { News } from './entities/news.entity';

@EntityRepository(News)
export class NewsRepository extends Repository<News> {}
