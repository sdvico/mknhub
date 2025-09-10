import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AgencyEntity } from '../../../../../agencies/infrastructure/persistence/relational/entities/agency.entity';

@Entity('Users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column({ default: 0 })
  state!: number;

  @Column()
  fullname!: string;

  @Column()
  phone!: string;

  @Column({ type: 'bit', default: false })
  verified!: boolean;

  @Column({ type: 'bit', default: true })
  enable!: boolean;

  @Column({ type: 'uuid', nullable: true })
  agency_id?: string;

  @ManyToOne(() => AgencyEntity, (agency) => agency.users)
  @JoinColumn({ name: 'agency_id' })
  agency?: AgencyEntity;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  agent_code?: string;
}
