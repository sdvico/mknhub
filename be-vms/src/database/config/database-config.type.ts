export type DatabaseConfig = {
  url: string;
  type: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  logging: boolean;
  autoLoadEntities: boolean;
  synchronize: boolean;
  options?: {
    encrypt?: boolean;
    trustServerCertificate?: boolean;
    enableArithAbort?: boolean;
  };
  connectionTimeout?: number;
  maxConnections?: number;
};
