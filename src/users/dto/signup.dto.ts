import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, Length, NotContains } from 'class-validator';
import { SignInDto } from './signin.dto';

export class SignUpDto extends PartialType(SignInDto) {
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  @NotContains(' ', {
    message: 'Bad username',
  })
  @NotContains('\n')
  username: string;
}
