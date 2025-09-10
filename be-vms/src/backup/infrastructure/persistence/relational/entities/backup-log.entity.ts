import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('Soba_BackupLog')
export class BackupLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  filename!: string;

  @Column()
  userid!: string;

  @CreateDateColumn()
  backupDate!: Date;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: true })
  isActive!: boolean;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userid' })
  user!: UserEntity;
}
