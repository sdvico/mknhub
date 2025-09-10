import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ShipNotificationEntity } from './ship-notification.entity';
import { UserPushTokenEntity } from '../../../../../user-push-tokens/infrastructure/persistence/relational/entities/user-push-token.entity';

@Entity({ name: 'Notifies' })
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  ShipNotifications_id?: string;

  @ManyToOne(() => ShipNotificationEntity, { nullable: true })
  @JoinColumn({ name: 'ShipNotifications_id' })
  shipNotification?: ShipNotificationEntity;

  @Column({ type: 'uuid', nullable: true })
  push_token_id?: string;

  @ManyToOne(() => UserPushTokenEntity, { nullable: true })
  @JoinColumn({ name: 'push_token_id' })
  pushToken?: UserPushTokenEntity;

  @Column({ nullable: true })
  plateNumber?: string;

  @Column({ nullable: true })
  user?: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  content?: string;

  @Column({ nullable: true })
  type?: string;

  @Column()
  created_at!: Date;

  @Column()
  create_by!: string;

  @Column()
  update_at!: Date;

  @Column()
  update_by!: string;

  @Column()
  status!: number;

  @Column({ nullable: true })
  stype?: string;

  @Column({ nullable: true })
  data?: string;
}
