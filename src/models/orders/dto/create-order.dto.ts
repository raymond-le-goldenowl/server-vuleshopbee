import { IsEmail, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  description: string;

  @IsString()
  @IsEmail()
  receiver: string;
}
