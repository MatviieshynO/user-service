import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
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
}
