export interface ShipNotificationData {
  id: string;
  clientReq: string;
  requestId: string;
  ship_code: string;
  occurred_at: Date;
  content: string;
  owner_name: string;
  owner_phone: string;
  type: string;
  status: string;
  boundary_crossed: boolean;
  boundary_near_warning: boolean;
  boundary_status_code?: string;
  created_at: Date;
  updated_at: Date;
  report?: {
    id: string;
    lat: number;
    lng: number;
    reported_at: Date;
    status: string;
    port_code?: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
  } | null;
}

export class Ship {
  id!: string;
  plate_number!: string;
  locationcode?: string;
  trackingid?: string;
  nkkt?: string;
  ownercode?: string;
  captioncode?: string;
  businesscode?: string;
  business2code?: string;
  business3code?: string;
  business4code?: string;
  licenseid?: string;
  length?: number;
  congsuat?: number;
  state!: number;
  HoHieu?: string;
  CoHieu?: string;
  IMO?: string;
  CangCaDangKyCode?: string;
  CangCaPhuCode?: string;
  TongTaiTrong?: number;
  ChieuRongLonNhat?: number;
  MonNuoc?: number;
  SoThuyenVien?: number;
  NgaySanXuat?: Date;
  NgayHetHan?: Date;
  DungTichHamCa?: number;
  VanTocDanhBat?: number;
  VanTocHanhTrinh?: number;
  name?: string;
  status?: string;
  last_ship_notification_id?: string;
  lastmessage?: ShipNotificationData;
  last_report_id?: string;
  lastReport?: {
    id: string;
    lat: number;
    lng: number;
    reported_at: Date;
    status: string;
    port_code?: string | null;
    description?: string | null;
    created_at: Date;
    updated_at: Date;
    source?: string | null;
  } | null;

  constructor(partial?: Partial<Ship>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
