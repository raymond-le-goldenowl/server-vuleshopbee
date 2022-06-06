import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateOrderBeforeCheckoutDto {
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  orderItemId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  productId: string;
}
