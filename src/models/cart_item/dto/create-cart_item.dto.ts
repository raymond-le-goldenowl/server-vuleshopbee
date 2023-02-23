import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  cartId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  productId: string;
}
