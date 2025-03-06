import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from '../logger/logger.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfirmCodeCleanupService } from './confirm-code-cleanup.service';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, LoggerModule],
  providers: [ConfirmCodeCleanupService],
})
export class CronModule {}
