import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '../config/config.service';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: this.configService.get('SMTP_SECURE'),
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    } as nodemailer.TransportOptions);
  }

  async sendMail(to: string, subject: string, html: string) {
    const from = this.configService.get('MAIL_FROM') || 'no-reply@example.com';

    await this.transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
  }
}
