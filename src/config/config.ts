import { ConfigType } from './types';

export default (): ConfigType => ({
  PORT: Number(process.env.PORT) || 3000,

  LOG_LEVEL: String(process.env.LOG_LEVEL || 'debug'),
  ELASTICSEARCH_URL: String(
    process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  ),
  ELASTICSEARCH_ENABLED: process.env.ELASTICSEARCH_ENABLED === 'true',
  LOG_TO_FILE: process.env.LOG_TO_FILE === 'true',
});
