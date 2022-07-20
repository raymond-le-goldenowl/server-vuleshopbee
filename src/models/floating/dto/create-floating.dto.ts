import { IsString } from 'class-validator';

export class CreateFloatingDto {
  text!: string;

  icon!: any;

  @IsString()
  href: string;
}
