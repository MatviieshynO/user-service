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
import { RefreshTokensDto } from './dto/refreshTokens.dto';
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

      // 2 Checking if the user has an active session.
      const activeSession = await this.sesionRepository.findSessionByUserId(user.id);
      if (activeSession) {
        throw new BadRequestException('You are already logged in. Please log out first.');
      }

      // 3. Checking if the email is verified
      if (!user.isVerified) {
        throw new BadRequestException('Email is not verified.');
      }

      // 4. Checking if the password is correct
      const isPasswordValid = await this.hashService.comparePasswords(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // 5. Genering`accessToken` and `refreshToken`
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

      // 6. Decoding the token to check its expiration time
      const decodedToken = this.jwtService.verifyToken(
        refreshToken,
        this.configService.get('JWT_REFRESH_SECRET'),
      );
      // 7. Before saving a new session, we delete all previous sessions.
      await this.sesionRepository.deleteAllSessions(user.id);

      // 8. Saving the session in the database
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

      // Переконуємось, що payload існує і має exp
      if (!payload || typeof payload.exp !== 'number') {
        throw new UnauthorizedException('Invalid token: missing exp field');
      }

      // 2. Deleting all sessions.
      await this.sesionRepository.deleteAllSessions(userId);

      // 3. Calculating time until expiration (TTL)
      const now = Math.floor(Date.now() / 1000); // Поточний час у секундах
      const expiresIn = Math.max(payload.exp - now, 0); // TTL у секундах

      // 4. Adding the revoked token to the blacklist with the correct TTL.
      await this.redisService.addToBlacklist(accessToken, expiresIn);

      return { message: 'Logged out successfully' };
    } catch (error) {
      this.logger.error('Logout failed', error, 'logout');
      throw error;
    }
  }

  async refreshToken({
    refreshToken,
    accessToken,
  }: RefreshTokensDto): Promise<{ newAccessToken: string; newRefreshToken: string }> {
    try {
      // 1. If the accessToken is still valid, return an error.
      const isValidAccessToken = this.jwtService.isValidToken(
        accessToken,
        this.configService.get('JWT_ACCESS_SECRET'),
      );
      if (isValidAccessToken) {
        throw new BadRequestException('Access token is still valid');
      }

      // 2. Check refreshToken
      const payload = this.jwtService.verifyToken(
        refreshToken,
        this.configService.get('JWT_REFRESH_SECRET'),
      );

      // 3. Checking if such a token exists in the database
      const session = await this.sesionRepository.findSessionByUserId(Number(payload.id));
      if (!session || refreshToken !== session.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // 4 Get current user
      const user = await this.userRepository.getUserById(Number(payload.id));
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // 5 Delete all session
      await this.sesionRepository.deleteAllSessions(user.id);

      // 6. Genering new accessToken and refreshToken
      const newAccessToken = this.jwtService.generateToken(
        { id: String(user.id), email: String(user.email), role: String(user.role) },
        this.configService.get('JWT_ACCESS_SECRET'),
        this.configService.get('JWT_ACCESS_EXPIRES_IN'),
      );
      const newRefreshToken = this.jwtService.generateToken(
        { id: String(user.id), email: String(user.email), role: String(user.role) },
        this.configService.get('JWT_REFRESH_SECRET'),
        this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      );

      // 7. Saving new session to database
      const decodedToken = this.jwtService.verifyToken(
        newRefreshToken,
        this.configService.get('JWT_REFRESH_SECRET'),
      );
      if (decodedToken.exp) {
        const expiresAt = new Date(decodedToken.exp * 1000);
        await this.sesionRepository.createSession(user.id, newRefreshToken, expiresAt);
      }

      return { newAccessToken, newRefreshToken };
    } catch (error) {
      this.logger.error('Logout failed', error, 'logout');
      throw error;
    }
  }
}
