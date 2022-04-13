import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDiscountDto {
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  product_id: string;
}
