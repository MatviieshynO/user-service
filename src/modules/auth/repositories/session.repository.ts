import { Injectable } from '@nestjs/common';
import { Session } from '@prisma/client';
import { PrismaService } from '../../../core/prisma/prisma.service';

@Injectable()
export class SessionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createSession(
    userId: number,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<Session> {
    return await this.prismaService.session.create({
      data: { userId, refreshToken, expiresAt },
    });
  }
  async deleteAllSessions(userId: number) {
    return await this.prismaService.session.deleteMany({ where: { userId } });
  }
}
