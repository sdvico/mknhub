import { registerAs } from '@nestjs/config';
import { AppConfig } from './app-config.type';

export default registerAs<AppConfig>('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  name: process.env.APP_NAME || 'SobaStracking',
  workingDirectory: process.env.PWD || process.cwd(),
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000,
  apiPrefix: process.env.API_PREFIX || 'api',
}));
