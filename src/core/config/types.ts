export interface ConfigType {
  PORT: number;

  LOG_LEVEL: string;
  ELASTICSEARCH_URL: string;
  ELASTICSEARCH_ENABLED: boolean;
  LOG_TO_FILE: boolean;

  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  DATABASE_URL: string;

  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  JWT_DEFAULT_SECRET: string;

  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_SECURE: string;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  MAIL_FROM: string;

  SALT_ROUNDS: number;

  CODE_EXPIRATION_TIME: number;
}
