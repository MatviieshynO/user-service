import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserNameDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name must be at most 50 characters long' })
  name: string;
}
