import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GroupEntity } from './group.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

@Entity('GroupUsers')
export class GroupUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userid!: string;

  @Column()
  groupid!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userid' })
  user!: UserEntity;

  @ManyToOne(() => GroupEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'groupid' })
  group!: GroupEntity;
}
