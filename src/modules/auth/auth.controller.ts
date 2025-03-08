import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequestWithUser } from '../../types/request-with-user.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokensDto } from './dto/refreshTokens.dto';
import { RegisterUserDto } from './dto/registerUser.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() body: RegisterUserDto): Promise<Omit<User, 'password'>> {
    return await this.authService.registerUser(body);
  }

  @Post('verify-email')
  async verifyEmail(@Body() body: VerifyEmailDto): Promise<{ message: string }> {
    return await this.authService.verifyEmail(body);
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Req() req: RequestWithUser): Promise<{ message: string }> {
    return await this.authService.logout(Number(req.user?.id), req.accessToken);
  }

  @Post('refresh')
  async refreshTokens(
    @Body() body: RefreshTokensDto,
  ): Promise<{ newAccessToken: string; newRefreshToken: string }> {
    return await this.authService.refreshToken(body);
  }
}
