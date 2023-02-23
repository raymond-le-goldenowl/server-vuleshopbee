import { PartialType } from '@nestjs/mapped-types';
import { CreateFloatingDto } from './create-floating.dto';

export class UpdateFloatingDto extends PartialType(CreateFloatingDto) {}
