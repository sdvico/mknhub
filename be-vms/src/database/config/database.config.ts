import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from './database-config.type';

export default registerAs<DatabaseConfig>('database', () => ({
  url: '',
  maxConnections: 100,
  autoLoadEntities: true,
  type: 'mssql',
  host: '',
  port: 1433,
  username: '',
  password: '',
  database: '',
  synchronize: false, // default false
  logging: false,
  connectionTimeout: 60000,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    server: '',
    port: 1433,
    authentication: {
      type: 'default',
      options: {
        userName: '',
        password: '',
      },
    },
    options: {
      encrypt: false,
      trustServerCertificate: true,
      enableArithAbort: true,
      validateBulkLoadParameters: false,
    },
  },
}));
