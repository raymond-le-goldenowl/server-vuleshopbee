import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DeleteCartItemDto {
  @IsNotEmpty()
  remove: boolean;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  cartId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  productId: string;
}
