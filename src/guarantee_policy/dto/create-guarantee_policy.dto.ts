import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateGuaranteePolicyDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  product_id: string;
}
