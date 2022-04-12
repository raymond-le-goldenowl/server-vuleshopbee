import { IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(1, 255)
  text: string;

  @IsString()
  @Length(1, 45)
  value: string;
}
