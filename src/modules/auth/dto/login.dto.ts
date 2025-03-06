import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
