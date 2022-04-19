import { EntityRepository, Repository } from 'typeorm';

import { Broadcast } from './entities/broadcast.entity';

@EntityRepository(Broadcast)
export class BroadcastsRepository extends Repository<Broadcast> {}
