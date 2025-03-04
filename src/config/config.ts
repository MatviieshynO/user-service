import { ConfigType } from './types';

export default (): ConfigType => ({
  port: Number(process.env.PORT) || 3000,
});
