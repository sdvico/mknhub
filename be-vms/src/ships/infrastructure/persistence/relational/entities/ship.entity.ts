import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Report } from '../../../../../reports/entities/report.entity';

export enum ShipStatus {
  DISCONNECTED = 'DISCONNECTED', // Chưa kết nối thiết bị giám sát
  CONNECTED = 'CONNECTED', // Đã kết nối thiết bị giám sát
  POSITION_DECLARED = 'POSITION_DECLARED', // Đã khai báo vị trí
  ACTIVE = 'ACTIVE', // Đang hoạt động bình thường
  INACTIVE = 'INACTIVE', // Không hoạt động
}

@Entity('Ships')
export class ShipEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  plate_number!: string;

  @Column({ nullable: true })
  locationcode?: string;

  @Column({ nullable: true })
  trackingid?: string;

  @Column({ nullable: true })
  nkkt?: string;

  @Column({ type: 'uuid', nullable: true })
  ownercode?: string;

  @Column({ type: 'uuid', nullable: true })
  captioncode?: string;

  @Column({ nullable: true })
  businesscode?: string;

  @Column({ nullable: true })
  business2code?: string;

  @Column({ type: 'text', nullable: true })
  business3code?: string;

  @Column({ type: 'text', nullable: true })
  business4code?: string;

  @Column({ type: 'text', nullable: true })
  licenseid?: string;

  @Column({ type: 'float', nullable: true })
  length?: number;

  @Column({ type: 'float', nullable: true })
  congsuat?: number;

  @Column()
  state!: number;

  @Column({ nullable: true })
  HoHieu?: string;

  @Column({ nullable: true })
  CoHieu?: string;

  @Column({ nullable: true })
  IMO?: string;

  @Column({ nullable: true })
  CangCaDangKyCode?: string;

  @Column({ nullable: true })
  CangCaPhuCode?: string;

  @Column({ type: 'float', nullable: true })
  TongTaiTrong?: number;

  @Column({ type: 'float', nullable: true })
  ChieuRongLonNhat?: number;

  @Column({ type: 'float', nullable: true })
  MonNuoc?: number;

  @Column({ type: 'int', nullable: true })
  SoThuyenVien?: number;

  @Column({ type: 'datetime', nullable: true })
  NgaySanXuat?: Date;

  @Column({ type: 'datetime', nullable: true })
  NgayHetHan?: Date;

  @Column({ type: 'float', nullable: true })
  DungTichHamCa?: number;

  @Column({ type: 'float', nullable: true })
  VanTocDanhBat?: number;

  @Column({ type: 'float', nullable: true })
  VanTocHanhTrinh?: number;

  @Column({ nullable: true })
  name?: string;

  @Column({
    type: 'nvarchar',
    length: 20,
    enum: ShipStatus,
    default: ShipStatus.DISCONNECTED,
  })
  status!: ShipStatus;

  @Column({ type: 'uuid', nullable: true, default: null })
  last_ship_notification_id?: string;

  @Column({ type: 'nvarchar', length: 20, nullable: true })
  ownerphone?: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  last_report_id?: string;

  @ManyToOne(() => Report)
  @JoinColumn({ name: 'last_report_id' })
  lastReport?: Report;
}
