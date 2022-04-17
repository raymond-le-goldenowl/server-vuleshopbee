import { IsString } from 'class-validator';

export class CreateNewsDto {
  text!: string;

  icon!: any;

  @IsString()
  href: string;
}
