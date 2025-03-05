import { Body, Controller, Delete, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequestWithUser } from '../../types/request-with-user.interface';
import { UpdateUserNameDto } from './dto/updateUserName.dto';
import { UpdateUserPasswordDto } from './dto/updateUserPassword.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: RequestWithUser): Promise<Omit<User, 'password'>> {
    return await this.userService.getProfile(Number(req.user?.id));
  }

  @Patch('me/name')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  async updateUserName(
    @Req() req: RequestWithUser,
    @Body() body: UpdateUserNameDto,
  ): Promise<Omit<User, 'password'>> {
    return await this.userService.updateName(Number(req.user?.id), body.name);
  }

  @Patch('me/password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  async updateUserPassword(
    @Req() req: RequestWithUser,
    @Body() body: UpdateUserPasswordDto,
  ): Promise<Omit<User, 'password'>> {
    return await this.userService.updatePassword(
      Number(req.user?.id),
      body.password,
      body.passwordConfirm,
    );
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @UseGuards(JwtAuthGuard)
  async deleteAccount(@Req() req: RequestWithUser): Promise<Omit<User, 'password'>> {
    return await this.userService.deleteAccount(Number(req.user?.id));
  }
}
