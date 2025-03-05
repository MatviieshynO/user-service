import { Module } from '@nestjs/common';
import { ConfigModule } from './core/config/config.module';
import { LoggerModule } from './core/logger/logger.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [ConfigModule, LoggerModule, PrismaModule, UsersModule],
})
export class AppModule {}
