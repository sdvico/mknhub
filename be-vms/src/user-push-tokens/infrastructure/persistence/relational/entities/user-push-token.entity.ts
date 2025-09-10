import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  Index,
} from 'typeorm';
import { NotificationEntity } from '../../../../../notifications/infrastructure/persistence/relational/entities/notification.entity';

@Entity({ name: 'UserPushTokens' })
export class UserPushTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userid!: string;

  @Column({ type: 'nvarchar', nullable: true })
  device_os?: string;

  @Column({ type: 'nvarchar', nullable: true, unique: true })
  @Index('IDX_UserPushTokens_push_token', { unique: true })
  push_token?: string;

  @CreateDateColumn({ type: 'datetime' })
  registered_date!: Date;

  @Column({ type: 'nvarchar', nullable: true })
  app_ver?: string;

  @Column({ type: 'nvarchar', nullable: true })
  module?: string;

  @ManyToMany(
    () => NotificationEntity,
    (notification) => notification.pushToken,
  )
  notifications?: NotificationEntity[];
}
