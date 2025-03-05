import { IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsString()
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsStrongPassword()
  passwordConfirm: string;
}
