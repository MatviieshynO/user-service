import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getProfile(id: number): Promise<Omit<User, 'password'>> {
    return await this.userRepository.getUserById(id);
  }

  async updateName(id: number, name: string): Promise<Omit<User, 'password'>> {
    return await this.userRepository.updateUser(id, { name });
  }
}
