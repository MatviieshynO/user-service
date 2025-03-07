import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { generateConfirmationCode } from '../../common/utils/generateConfirmationCode';
import { ConfigService } from '../../core/config/config.service';
import { HashService } from '../../core/hash/hash.service';
import { JwtService } from '../../core/jwt/jwt.service';
import { LoggerService } from '../../core/logger/logger.service';
import { MailService } from '../../core/mail/mail.service';
import { confirmationEmailTemplate } from '../../core/mail/templates/confirmationEmail';
import { emailVerifiedTemplate } from '../../core/mail/templates/emailVerifiedTemplate';
import { RedisService } from '../../core/redis/redis.service';
import { UserRepository } from '../user/user.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/registerUser.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ConfirmCodeRepository } from './repositories/confirmCode.repository';
import { SessionRepository } from './repositories/session.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
    private readonly hashService: HashService,
    private readonly mailService: MailService,
    private readonly confirmCodeRepository: ConfirmCodeRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly sesionRepository: SessionRepository,
    private readonly redisService: RedisService,
  ) {}

  async registerUser({
    name,
    email,
    password,
    passwordConfirm,
  }: RegisterUserDto): Promise<Omit<User, 'password'>> {
    try {
      //  1. Checking if passwords match
      if (password !== passwordConfirm) {
        throw new BadRequestException('Passwords do not match');
      }
      // 2. Hashing the password
      const hashPassword = await this.hashService.hashPassword(password);

      // 3. Creating and return  user
      const user = await this.userRepository.createUser({
        name,
        email,
        password: hashPassword,
      });
      // 4. Generate a 6-digit verification code
      const code = generateConfirmationCode();

      // 5. Set the expiration time for the verification code (retrieved from the config)
      const expiresAt = new Date(
        Date.now() + this.configService.get('CODE_EXPIRATION_TIME'),
      );

      // 6. Generate the email template with the verification code
      const template = confirmationEmailTemplate(code);

      // 7. Send the email with the verification code
      this.mailService
        .sendMail(email, 'Confirmation Email Address', template)
        .catch((error) => {
          this.logger.error('Error sending confirmation email', error, 'registerUser');
        });

      // 8. Save the verification code in the database
      await this.confirmCodeRepository.saveCode(
        email, // User's email
        code, // Generated verification code
        expiresAt, // Expiration time
        'EMAIL', // Verification type (EMAIL, SMS, etc.)
      );

      return user;
    } catch (error) {
      this.logger.error('Register user is failed', error, 'AuthService');
      throw error;
    }
  }

  async verifyEmail({ code, email }: VerifyEmailDto): Promise<{ message: string }> {
    try {
      // 1. Finding the code in the database
      const verification = await this.confirmCodeRepository.findByEmail(email);

      // 2. Checking if the code is not expired
      if (new Date() > verification.expiresAt) {
        await this.confirmCodeRepository.deleteByEmail(email);
        throw new BadRequestException(
          'Verification code has expired. Please request a new one.',
        );
      }

      // 3. Checking if the code matches
      if (verification.code !== code) {
        throw new BadRequestException('Invalid verification code.');
      }

      // 4. Updating the verification status in User
      await this.userRepository.updateUser(email, { isVerified: true });

      // 5. Deleting the used code
      await this.confirmCodeRepository.deleteByEmail(email);

      // 6. Sending an email about successful verification
      const template = emailVerifiedTemplate();
      this.mailService
        .sendMail(email, 'Your emeail is verified', template)
        .catch((error) => {
          this.logger.error(
            'Error sending email after verification',
            error,
            'verifyEmail',
          );
        });

      return { message: 'Email successfully verified.' };
    } catch (error) {
      this.logger.error('Verify email is failed', error, 'verifyEmail');
      throw error;
    }
  }

  async login({
    email,
    password,
  }: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // 1. Finding the user in the database
      const user = await this.userRepository.getUserByEmail(email);

      // 2. Checking if the email is verified
      if (!user.isVerified) {
        throw new BadRequestException('Email is not verified.');
      }

      // 3. Checking if the password is correct
      const isPasswordValid = await this.hashService.comparePasswords(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // 4. Genering`accessToken` and `refreshToken`
      const accessToken = this.jwtService.generateToken(
        { id: String(user.id), email: String(user.email), role: String(user.role) },
        this.configService.get('JWT_ACCESS_SECRET'),
        this.configService.get('JWT_ACCESS_EXPIRES_IN'),
      );
      const refreshToken = this.jwtService.generateToken(
        { id: String(user.id), email: String(user.email), role: String(user.role) },
        this.configService.get('JWT_REFRESH_SECRET'),
        this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      );

      // 5. Decoding the token to check its expiration time
      const decodedToken = this.jwtService.verifyToken(
        refreshToken,
        this.configService.get('JWT_REFRESH_SECRET'),
      );
      // 6. Before saving a new session, we delete all previous sessions.
      await this.sesionRepository.deleteAllSessions(user.id);

      // 7. Saving the session in the database
      if (decodedToken.exp) {
        const expiresAt = new Date(decodedToken.exp * 1000);
        await this.sesionRepository.createSession(user.id, refreshToken, expiresAt);
      }
      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error('Login is failed', error, 'login');
      throw error;
    }
  }

  async logout(userId: number, accessToken: string) {
    try {
      // 1. Decoding the token to get the exp (expiration time).
      const payload = this.jwtService.verifyToken(
        accessToken,
        this.configService.get('JWT_ACCESS_SECRET'),
      );

      // 2. Deleting all sessions.
      await this.sesionRepository.deleteAllSessions(userId);

      // 3. Adding the revoked token to the blacklist and setting the expiration time.
      await this.redisService.addToBlacklist(accessToken, Number(payload.exp));

      return { message: 'Logged out successfully' };
    } catch (error) {
      this.logger.error('Login is failed', error, 'login');
      throw error;
    }
  }
}
