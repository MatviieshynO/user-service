import { Module } from '@nestjs/common';
import { GuardsModule } from '../../common/guards/guards.module';
import { ConfigModule } from '../../core/config/config.module';
import { ConfirmCodeCleanupService } from '../../core/cron/confirm-code-cleanup.service';
import { HashModule } from '../../core/hash/hash.module';
import { JwtModule } from '../../core/jwt/jwt.module';
import { LoggerModule } from '../../core/logger/logger.module';
import { MailModule } from '../../core/mail/mail.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfirmCodeRepository } from './repositories/confirmCode.repository';
import { SessionRepository } from './repositories/session.repository';

@Module({
  imports: [
    UserModule,
    LoggerModule,
    HashModule,
    MailModule,
    ConfigModule,
    JwtModule,
    GuardsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfirmCodeRepository,
    ConfirmCodeCleanupService,
    SessionRepository,
  ],
  exports: [ConfirmCodeRepository],
})
export class AuthModule {}
