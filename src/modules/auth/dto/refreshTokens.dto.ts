import { IsString } from 'class-validator';

export class RefreshTokensDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
