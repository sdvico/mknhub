import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Entity('UserLoginTokens')
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userid!: string;

  @Column()
  token!: string;

  @Column()
  created_date!: Date;

  @Column()
  expired_date!: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userid' })
  user!: UserEntity;
}
