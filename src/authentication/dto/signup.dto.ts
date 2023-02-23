import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
  NotContains,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  @NotContains(' ', {
    message: 'Username must not contains spaces',
  })
  @NotContains('\n')
  @Matches(/^[a-z0-9_\.]+$/, {
    message: ` Username just contains Lowercase Letters (a-z), numbers (0-9), dots (.) and underscores (_)`,
  })
  username: string;

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
