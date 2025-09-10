import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'NotificationTypes' })
export class NotificationTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'nvarchar', length: 50, unique: true })
  code!: string;

  @Column({ type: 'nvarchar', length: 255 })
  name!: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  form_type?: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  icon?: string;

  @Column({ type: 'nvarchar', length: 20, nullable: true })
  color?: string;

  @Column({ type: 'nvarchar', length: 20, nullable: true })
  background_color?: string;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  title?: string;

  @Column({ type: 'ntext', nullable: true })
  template_message?: string;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  next_action?: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at!: Date;

  @Column({ type: 'int', nullable: true, default: null })
  priority?: number | null;
}
