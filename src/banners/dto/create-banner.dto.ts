import { IsString } from 'class-validator';

export class CreateBannerDto {
  text!: string;

  icon!: any;

  @IsString()
  href: string;
}
