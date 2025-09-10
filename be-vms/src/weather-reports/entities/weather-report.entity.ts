import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('WeatherReports')
export class WeatherReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('nvarchar', { length: 255 })
  region: string;

  @Column('ntext')
  summary: string;

  @Column('ntext', { nullable: true })
  advice: string;

  @Column('nvarchar', { length: 500, nullable: true })
  link: string;

  // Thông tin chi tiết thời tiết biển
  @Column('nvarchar', { length: 255, nullable: true })
  cloud: string; // Ví dụ: "Có mây, không mưa"

  @Column('nvarchar', { length: 255, nullable: true })
  rain: string; // Ví dụ: "Không mưa", "Mưa nhỏ"

  @Column('nvarchar', { length: 255, nullable: true })
  wind: string; // Ví dụ: "Gió Đông Bắc cấp 3-4"

  @Column('nvarchar', { length: 255, nullable: true })
  wave: string; // Ví dụ: "Sóng cao 1-2m"

  @Column('nvarchar', { length: 255, nullable: true })
  visibility: string; // Ví dụ: "Tầm nhìn xa 8-12km"

  @Column('ntext', { nullable: true })
  recommendation: string; // Khuyến cáo cho ngư dân

  @Column('int', { default: 0 })
  total_views: number;

  @Column('int', { default: 0 })
  total_clicks: number;

  @Column('bit', { default: true })
  enable: boolean;

  @Column('datetime', { nullable: true })
  published_at?: Date;

  @CreateDateColumn({
    type: 'datetime',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'datetime',
  })
  updated_at: Date;
}
