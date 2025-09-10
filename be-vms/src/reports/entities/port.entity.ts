import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Report } from './report.entity';

@Entity('Ports')
export class Port {
  // Use code as natural primary key
  @PrimaryColumn('nvarchar', { length: 100 })
  code!: string;

  @Column('nvarchar', { length: 255 })
  name!: string;

  @Column('nvarchar', { length: 255 })
  loCode!: string;

  @Column('float', { nullable: true })
  lat?: number;

  @Column('float', { nullable: true })
  lng?: number;

  @Column('nvarchar', { length: 255, nullable: true })
  TCTS_Code?: string;

  // address can be large text
  @Column('ntext', { nullable: true })
  address?: string | null;

  @Column('nvarchar', { length: 255, nullable: true })
  phone?: string | null;

  @Column('nvarchar', { length: 255, nullable: true })
  fax?: string | null;

  @Column('nvarchar', { length: 255, nullable: true })
  email?: string | null;

  @Column('nvarchar', { length: 50, nullable: true })
  contact?: string | null;

  @Column('nvarchar', { length: 255, nullable: true })
  contactPhone?: string | null;

  @Column('nvarchar', { length: 150, nullable: true })
  description?: string | null;

  @OneToMany(() => Report, (report) => report.port)
  reports?: Report[];
}
