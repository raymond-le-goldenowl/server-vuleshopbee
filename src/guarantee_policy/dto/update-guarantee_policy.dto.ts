import { PartialType } from '@nestjs/mapped-types';
import { CreateGuaranteePolicyDto } from './create-guarantee_policy.dto';

export class UpdateGuaranteePolicyDto extends PartialType(
  CreateGuaranteePolicyDto,
) {}
