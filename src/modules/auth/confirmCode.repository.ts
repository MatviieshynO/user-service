import { Injectable } from '@nestjs/common';
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

    console.log('Saved Code:', savedCode);
    return savedCode;
  }
}
