import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: '192.168.150.146',
  port: 1433,
  username: 'sa',
  password: 'Sa123456@@',
  database: 'MknHub',
  synchronize: false,
  dropSchema: false,
  keepConnectionAlive: true,
  logging: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src',
    subscribersDir: 'subscriber',
  },
  extra: {
    max: 100,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      enableArithAbort: true,
      validateBulkLoadParameters: false,
    },
  },
} as DataSourceOptions);
