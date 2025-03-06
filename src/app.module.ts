import { Module } from '@nestjs/common';
import { GuardsModule } from './common/guards/guards.module';
import { ConfigModule } from './core/config/config.module';
import { HashModule } from './core/hash/hash.module';
import { JwtModule } from './core/jwt/jwt.module';
import { LoggerModule } from './core/logger/logger.module';
import { MailModule } from './core/mail/mail.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    PrismaModule,
    GuardsModule,
    JwtModule,
    MailModule,
    UserModule,
    AuthModule,
    HashModule,
  ],
})
export class AppModule {}
