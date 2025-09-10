import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/infrastructure/persistence/relational/entities/user.entity';
import { ShipEntity } from '../../ships/infrastructure/persistence/relational/entities/ship.entity';
import { Port } from './port.entity';

export enum ReportStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('Reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 12, scale: 8 })
  lat: number;

  @Column('decimal', { precision: 12, scale: 8 })
  lng: number;

  @Column('datetime')
  reported_at: Date;

  @Column('nvarchar', { length: 20, default: ReportStatus.PENDING })
  status: ReportStatus;

  @Column('uniqueidentifier', { nullable: true })
  reporter_user_id: string;

  @Column('uniqueidentifier', { nullable: true })
  reporter_ship_id: string;

  @Column('nvarchar', { length: 100, nullable: true, default: null })
  port_code?: string;

  @Column('nvarchar', { length: 1000, nullable: true, default: null })
  description?: string;

  @Column('nvarchar', { length: 10, nullable: true, default: null })
  source?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'reporter_user_id' })
  reporter_user: UserEntity;

  @ManyToOne(() => ShipEntity, { nullable: true })
  @JoinColumn({ name: 'reporter_ship_id' })
  reporter_ship: ShipEntity;

  @ManyToOne(() => Port, { nullable: true })
  @JoinColumn({ name: 'port_code', referencedColumnName: 'code' })
  port?: Port | null;
}
