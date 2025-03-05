import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE'),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    } as nodemailer.TransportOptions);
  }

  async sendMail(to: string, subject: string, html: string) {
    const from =
      this.configService.get<string>('MAIL_FROM') || 'no-reply@example.com';

    await this.transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
  }
}
