import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
  NotContains,
} from 'class-validator';
export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @NotContains(' ', {
    message: 'Email must not contains spaces',
  })
  email: string;

  @IsString()
  @MinLength(8)
  @Length(8, 255)
  @NotContains(' ')
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at lesat 1 upper case letter, least 1 lower case letter, 1 number or special character',
  })
  password: string;
}
