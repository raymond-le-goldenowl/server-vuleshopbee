import { Menu } from 'src/menu/entities/menu.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Menu)
export class MenuRepository extends Repository<Menu> {}
