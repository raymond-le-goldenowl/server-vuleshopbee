import { Tag } from 'src/tags/entities/tag.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Tag)
export class TagsRepository extends Repository<Tag> {}
