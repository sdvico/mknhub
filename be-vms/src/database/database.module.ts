import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './config/database-config.type';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<DatabaseConfig>('database', {
          infer: true,
        });
        return {
          type: dbConfig.type as any,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          logging: dbConfig.logging,
          autoLoadEntities: dbConfig.autoLoadEntities,
          synchronize: dbConfig.synchronize,
          options: {
            encrypt: false,
            trustServerCertificate: true,
            enableArithAbort: true,
          },
          extra: {
            encrypt: false,
            trustServerCertificate: true,
            enableArithAbort: true,
            options: {
              encrypt: false,
              trustServerCertificate: true,
              enableArithAbort: true,
            },
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
