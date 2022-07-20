import { IsString } from 'class-validator';

export class CreateKeywordDto {
  @IsString()
  text: string;

  icon!: string;

  @IsString()
  href: string;
}
