import { IsString } from 'class-validator';

export class CreateBroadcastDto {
  text!: string;

  @IsString()
  icon: string;

  @IsString()
  href: string;
}
