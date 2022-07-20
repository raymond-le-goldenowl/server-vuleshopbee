import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateOrderItemDto {
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  productId: string;
}
