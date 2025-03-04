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
}
