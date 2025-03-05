import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequestWithUser } from '../../types/request-with-user.interface';
import { UpdateUserNameDto } from './dto/updateUserName.dto';
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
  async updateUserName(
    @Req() req: RequestWithUser,
    @Body() body: UpdateUserNameDto,
  ): Promise<Omit<User, 'password'>> {
    return await this.userService.updateName(Number(req.user?.id), body.name);
  }
}
