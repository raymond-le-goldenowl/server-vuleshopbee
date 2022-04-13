import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 320)
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  citizen_identity: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 45)
  verify: string;
}
