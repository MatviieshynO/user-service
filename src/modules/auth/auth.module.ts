import { Module } from '@nestjs/common';
import { ConfigModule } from '../../core/config/config.module';
import { HashModule } from '../../core/hash/hash.module';
import { LoggerModule } from '../../core/logger/logger.module';
import { MailModule } from '../../core/mail/mail.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfirmCodeRepository } from './confirmCode.repository';

@Module({
  imports: [UserModule, LoggerModule, HashModule, MailModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, ConfirmCodeRepository],
  exports: [ConfirmCodeRepository],
})
export class AuthModule {}
