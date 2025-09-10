import { AppConfig } from './app-config.type';
import { DatabaseConfig } from '../database/config/database-config.type';
import { FileConfig } from '../files/config/file-config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  file: FileConfig;
};
