import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum LogType {
  REQUEST = 'REQUEST',
  RESPONSE = 'RESPONSE',
  ERROR = 'ERROR',
}

@Entity({ name: 'ShipNotificationLogs' })
export class ShipNotificationLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  shipNotificationId!: string | null;

  @Column({ type: 'nvarchar', length: 255 })
  clientReq!: string;

  @Column({
    type: 'nvarchar',
    length: 20,
    enum: LogType,
  })
  logType!: LogType;

  @Column({ type: 'nvarchar', length: 50 })
  endpoint!: string;

  @Column({ type: 'nvarchar', length: 10 })
  method!: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  statusCode?: string;

  @Column({ type: 'ntext', nullable: true })
  requestBody?: string;

  @Column({ type: 'ntext', nullable: true })
  responseBody?: string;

  @Column({ type: 'ntext', nullable: true })
  errorMessage?: string;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  userAgent?: string;

  @Column({ type: 'nvarchar', length: 45, nullable: true })
  ipAddress?: string;

  @Column({ type: 'int' })
  responseTime!: number; // milliseconds

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;
}
