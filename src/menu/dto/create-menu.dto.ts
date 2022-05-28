import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  icon!: any;

  href!: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  category_id: string;
}
