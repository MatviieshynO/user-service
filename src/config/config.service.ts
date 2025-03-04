import { Injectable } from '@nestjs/common';
import config from './config';
import { ConfigType } from './types';

@Injectable()
export class ConfigService {
  private readonly envConfig: ConfigType;

  constructor() {
    this.envConfig = config();
  }

  get<Key extends keyof ConfigType>(key: Key): ConfigType[Key] {
    if (!(key in this.envConfig)) {
      throw new Error(`Config error: Missing key "${key}"`);
    }

    return this.envConfig[key];
  }
}
