import { ConfigType } from './types';

export default (): ConfigType => ({
  PORT: Number(process.env.PORT) || 3000,

  LOG_LEVEL: String(process.env.LOG_LEVEL || 'debug'),
  ELASTICSEARCH_URL: String(process.env.ELASTICSEARCH_URL || 'http://localhost:9200'),
  ELASTICSEARCH_ENABLED: process.env.ELASTICSEARCH_ENABLED === 'true',
  LOG_TO_FILE: process.env.LOG_TO_FILE === 'true',

  POSTGRES_USER: String(process.env.POSTGRES_USER),
  POSTGRES_PASSWORD: String(process.env.POSTGRES_PASSWORD),
  POSTGRES_DB: String(process.env.POSTGRES_DB),
  DATABASE_URL: String(process.env.DATABASE_URL),
  JWT_ACCESS_SECRET: String(process.env.JWT_ACCESS_SECRET),
  JWT_REFRESH_SECRET: String(process.env.JWT_REFRESH_SECRET),
  JWT_ACCESS_EXPIRES_IN: String(process.env.JWT_ACCESS_EXPIRES_IN),
  JWT_REFRESH_EXPIRES_IN: String(process.env.JWT_REFRESH_EXPIRES_IN),
  JWT_DEFAULT_SECRET: String(process.env.JWT_DEFAULT_SECRET),

  SMTP_HOST: String(process.env.SMTP_HOST),
  SMTP_PORT: String(process.env.SMTP_PORT),
  SMTP_SECURE: String(process.env.SMTP_SECURE),
  SMTP_USER: String(process.env.SMTP_USER),
  SMTP_PASSWORD: String(process.env.SMTP_PASSWORD),
  MAIL_FROM: String(process.env.MAIL_FROM),

  SALT_ROUNDS: Number(process.env.SALT_ROUNDS),

  CODE_EXPIRATION_TIME: Number(process.env.CODE_EXPIRATION_TIME),

  REDIS_PASSWORD: String(process.env.REDIS_PASSWORD),
  REDIS_URL: String(process.env.REDIS_URL),
});
