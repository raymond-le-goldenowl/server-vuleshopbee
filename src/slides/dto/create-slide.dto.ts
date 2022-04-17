import { IsString } from 'class-validator';

export class CreateSlideDto {
  text!: string;

  icon!: any;

  @IsString()
  href: string;
}
