import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderStatusCodeDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
