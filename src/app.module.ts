import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { LoggerModule } from './logger/logger.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ConfigModule, LoggerModule, PrismaModule],
})
export class AppModule {}
