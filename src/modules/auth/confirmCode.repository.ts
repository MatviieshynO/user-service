import { Injectable, NotFoundException } from '@nestjs/common';
import { VerificationCode } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class ConfirmCodeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async saveCode(
    email: string,
    code: string,
    expiresAt: Date,
    type: 'EMAIL' | 'PHONE',
  ): Promise<VerificationCode> {
    const savedCode = await this.prismaService.verificationCode.upsert({
      where: { email },
      update: { code, expiresAt, type },
      create: { email, code, expiresAt, type },
    });

    return savedCode;
  }

  async findByEmail(email: string) {
    return await this.prismaService.verificationCode
      .findUniqueOrThrow({
        where: { email },
      })
      .catch(() => {
        throw new NotFoundException('Verification code not found.');
      });
  }

  async deleteByEmail(email: string) {
    return await this.prismaService.verificationCode
      .delete({ where: { email } })
      .catch(() => {
        throw new NotFoundException('Verification code not found.');
      });
  }
}
