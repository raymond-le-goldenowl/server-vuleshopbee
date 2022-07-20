import { EntityRepository, Repository } from 'typeorm';

import { Category } from 'src/models/categories/entities/category.entity';

@EntityRepository(Category)
export class CategoriesRepository extends Repository<Category> {}
