import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Groups')
export class GroupEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;
}
