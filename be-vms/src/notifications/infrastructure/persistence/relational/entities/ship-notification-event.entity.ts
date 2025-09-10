import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'ShipNotificationEvents' })
export class ShipNotificationEventEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('IDX_ShipNotificationEvents_ship_code')
  @Column({ type: 'nvarchar', length: 255 })
  ship_code!: string;

  @Index('IDX_ShipNotificationEvents_user_report_time')
  @Column({ type: 'datetime', nullable: true, default: null })
  user_report_time?: Date | null;

  // Event type to categorize scenarios (e.g., MKN_6H, MKN_8D, etc.)
  @Index('IDX_ShipNotificationEvents_event_type')
  @Column({ type: 'nvarchar', length: 20, nullable: true, default: null })
  type?: string | null;

  // Start when first MKN_6H notification arrives
  @Column({ type: 'datetime', nullable: true, default: null })
  started_at?: Date | null;

  // When officer resolves the event
  @Column({ type: 'datetime', nullable: true, default: null })
  resolved_at?: Date | null;

  // Minutes from MKN_6H start to first user report
  @Column({ type: 'int', nullable: true, default: null })
  response_minutes_from_6h?: number | null;

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at!: Date;
}
