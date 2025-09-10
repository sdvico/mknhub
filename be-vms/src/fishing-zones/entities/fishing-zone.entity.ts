import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('FishingZones')
export class FishingZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('nvarchar', { length: 255 })
  title: string;

  @Column('ntext', { nullable: true })
  description: string;

  @Column('nvarchar', { length: 500, nullable: true })
  link: string;

  @Column('int', { default: 0 })
  total_views: number;

  @Column('int', { default: 0 })
  total_clicks: number;

  @Column('bit', { default: true })
  enable: boolean;

  @Column('datetime', { nullable: true })
  published_at?: Date;

  @CreateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
  updated_at: Date;
}
