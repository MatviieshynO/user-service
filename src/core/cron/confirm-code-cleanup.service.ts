import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '../../core/logger/logger.service';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class ConfirmCodeCleanupService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async removeExpiredCodes() {
    try {
      const now = new Date();
      const deleted = await this.prismaService.verificationCode.deleteMany({
        where: { expiresAt: { lt: now } },
      });

      if (deleted.count > 0) {
        this.logger.log(`Deleted ${deleted.count} expired verification codes.`);
      }
    } catch (error) {
      this.logger.error('Error deleting expired verification codes:', error);
    }
  }
}
