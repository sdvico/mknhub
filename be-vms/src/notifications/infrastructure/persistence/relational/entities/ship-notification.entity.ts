import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Report } from '../../../../../reports/entities/report.entity';
import { ShipNotificationEventEntity } from './ship-notification-event.entity';

export enum ShipNotificationType {
  NORMAL = 'NORMAL',
  MKN_2H = 'MKN_2H',
  MKN_5H = 'MKN_5H',
  MKN_6H = 'MKN_6H',
  MKN_8D = 'MKN_8D',
  MKN_10D = 'MKN_10D',
  KNL = 'KNL',
  NEAR_BORDER = 'NEAR_BORDER',
  CROSS_BORDER = 'CROSS_BORDER',
}

export enum ShipNotificationStatus {
  QUEUED = 'QUEUED',
  SENDING = 'SENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  DUPLICATE = 'DUPLICATE',
}

export enum ShipNotificationFailureReason {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  NO_DEVICE_FOUND = 'NO_DEVICE_FOUND',
  FIREBASE_ERROR = 'FIREBASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

@Entity({ name: 'ShipNotifications' })
export class ShipNotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', unique: true, default: () => 'NEWID()' })
  clientReq!: string;

  @Column({ type: 'uuid', unique: true, default: () => 'NEWID()' })
  requestId!: string;

  @Column()
  ship_code!: string;

  @Column({ type: 'datetime' })
  occurred_at!: Date;

  @Column({ type: 'nvarchar', length: 500 })
  content!: string;

  @Column()
  owner_name!: string;

  @Column()
  owner_phone!: string;

  @Column({
    type: 'nvarchar',
    length: 20,
    enum: ShipNotificationType,
  })
  type!: ShipNotificationType;

  @Column({
    type: 'nvarchar',
    length: 20,
    enum: ShipNotificationStatus,
    default: ShipNotificationStatus.QUEUED,
  })
  status!: ShipNotificationStatus;

  @Column({ type: 'bit', default: false })
  boundary_crossed!: boolean;

  @Column({ type: 'bit', default: false })
  boundary_near_warning!: boolean;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  boundary_status_code?: string;

  @Column({ type: 'int', default: 0 })
  retry_number!: number;

  @Column({ type: 'int', default: 0 })
  max_retry!: number;

  @Column({ type: 'datetime', nullable: true, default: null })
  next_retry?: Date;

  @Column({
    type: 'nvarchar',
    length: 1024,
    enum: ShipNotificationFailureReason,
    nullable: true,
    default: null,
  })
  reason?: ShipNotificationFailureReason;

  @Column({ type: 'uuid', nullable: true, default: null })
  reports_id?: string;

  @ManyToOne(() => Report)
  @JoinColumn({ name: 'reports_id' })
  report?: Report;

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at!: Date;

  @Column({ type: 'bit', default: false })
  is_viewed!: boolean;

  @Column({ type: 'datetime', nullable: true, default: null })
  viewed_at?: Date | null;

  @Column({ type: 'decimal', precision: 12, scale: 8, nullable: true })
  lat?: number;

  @Column({ type: 'decimal', precision: 12, scale: 8, nullable: true })
  lng?: number;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  agent_code?: string;

  @Column({ type: 'ntext', nullable: true })
  formatted_message?: string;

  // New nullable fields
  @Column({ type: 'uuid', nullable: true, default: null })
  next_notification_id?: string | null;

  @Column({ type: 'uuid', nullable: true, default: null })
  next_notification_type_id?: string | null;

  @Column({ type: 'datetime', nullable: true, default: null })
  resolved_at?: Date | null;

  @Column({ type: 'bit', nullable: true, default: null })
  active?: boolean | null;

  @Column({ type: 'bit', nullable: true, default: null })
  repeat_daily?: boolean | null;

  @Column({ type: 'bit', nullable: true, default: null })
  repeat_until_resolved?: boolean | null;

  @Column({ type: 'int', nullable: true, default: null })
  priority?: number | null;

  // Link to ShipNotificationEvent
  @Column({ type: 'uuid', nullable: true, default: null })
  event_id?: string | null;

  @ManyToOne(() => ShipNotificationEventEntity, { nullable: true })
  @JoinColumn({ name: 'event_id' })
  event?: ShipNotificationEventEntity | null;

  // Link to boundary event (near/crossed)
  @Column({ type: 'uuid', nullable: true, default: null })
  boundary_event_id?: string | null;
}
