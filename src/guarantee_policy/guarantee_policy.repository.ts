import { EntityRepository, Repository } from 'typeorm';
import { GuaranteePolicy } from './entities/guarantee_policy.entity';

@EntityRepository(GuaranteePolicy)
export class GuaranteePolicyRepository extends Repository<GuaranteePolicy> {}
