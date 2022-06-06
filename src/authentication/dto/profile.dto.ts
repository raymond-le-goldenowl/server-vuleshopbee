import {
  Max,
  Length,
  IsUUID,
  IsString,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';

export class ProfileDto {
  @IsString()
  @IsNotEmpty()
  @Max(15)
  citizen_identity: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  full_name: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  gender_id: string;

  @IsString()
  @IsNotEmpty()
  @IsBoolean()
  public: boolean;

  @IsString()
  @IsNotEmpty()
  @Max(15)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  district_id: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  province_id: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  street: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  ward_id: string;
}
