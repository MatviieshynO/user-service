import { Client } from '@elastic/elasticsearch';
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '../config/config.service';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly esClient: Client | null = null;
  private readonly logLevel: string;
  private readonly logFilePath: string;
  private readonly logToFile: boolean;

  constructor(private readonly configService: ConfigService) {
    this.logLevel = this.configService.get('LOG_LEVEL');
    this.logFilePath = path.join(__dirname, '../../logs/app.log');
    this.logToFile = this.configService.get('LOG_TO_FILE');

    if (this.configService.get('ELASTICSEARCH_ENABLED')) {
      this.esClient = new Client({
        node: this.configService.get('ELASTICSEARCH_URL'),
      });
    }
  }

  log(message: string, context?: string) {
    this.writeLog('info', message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.writeLog('error', message, context, trace);
  }

  warn(message: string, context?: string) {
    this.writeLog('warn', message, context);
  }

  debug(message: string, context?: string) {
    if (this.logLevel === 'debug') {
      this.writeLog('debug', message, context);
    }
  }

  verbose(message: string, context?: string) {
    if (this.logLevel === 'verbose') {
      this.writeLog('verbose', message, context);
    }
  }

  private async writeLog(
    level: string,
    message: string,
    context?: string,
    trace?: string,
  ) {
    const logData = {
      '@timestamp': new Date().toISOString(),
      level: level,
      message: message,
      context: context || 'Application',
      trace: trace || null,
    };

    const logMessage = `[${logData['@timestamp']}] [${level.toUpperCase()}] ${message}`;

    console.log(logMessage); // ✅ Console

    if (this.logToFile) {
      this.writeToFile(logMessage); // File
    }

    if (this.esClient) {
      try {
        await this.esClient.index({
          index: `nestjs-logs-${new Date().toISOString().slice(0, 10)}`,
          body: logData,
        });
      } catch (error) {
        console.error('Elasticsearch logging error:', error);
      }
    }
  }

  private writeToFile(message: string) {
    fs.appendFile(this.logFilePath, message + '\n', (err) => {
      if (err) {
        console.error('Error writing log to file:', err);
      }
    });
  }
}
