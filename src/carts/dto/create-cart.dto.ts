import { IsBoolean } from 'class-validator';

export class CreateCartDto {
  @IsBoolean()
  accept_guaratee_policy: boolean;
}
