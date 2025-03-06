import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserById(id: number): Promise<Omit<User, 'password'>> {
    return this.prismaService.user
      .findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          isVerified: true,
          avatar: true,
          settings: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      .catch(() => {
        throw new NotFoundException(`User with ID ${id} not found`);
      });
  }

  async updateUser(
    id: number,
    updateData: Prisma.UserUpdateInput,
  ): Promise<Omit<User, 'password'>> {
    return await this.prismaService.user
      .update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          isVerified: true,
          avatar: true,
          settings: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      .catch(() => {
        throw new NotFoundException(`User with ID ${id} not found`);
      });
  }

  async deleteUser(id: number): Promise<Omit<User, 'password'>> {
    return await this.prismaService.user
      .delete({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          isVerified: true,
          avatar: true,
          settings: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      .catch(() => {
        throw new NotFoundException(`User with ID ${id} not found`);
      });
  }

  async createUser(createData: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
    return await this.prismaService.user
      .create({
        data: { ...createData },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          isVerified: true,
          avatar: true,
          settings: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      .catch((error) => {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ConflictException('User with this email already exists');
        }
        console.log(error);
        throw new InternalServerErrorException('Internal server error');
      });
  }
}
