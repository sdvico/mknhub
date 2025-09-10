import {Notification} from '../Notification/types';

export enum ShipStatus {
  DISCONNECTED = 'DISCONNECTED', // Chưa kết nối thiết bị giám sát
  CONNECTED = 'CONNECTED', // Đã kết nối thiết bị giám sát
  POSITION_DECLARED = 'POSITION_DECLARED', // Đã khai báo vị trí
  ACTIVE = 'ACTIVE', // Đang hoạt động bình thường
  INACTIVE = 'INACTIVE', // Không hoạt động
}

export interface ShipLastReport {
  id: string;
  lat: number;
  lng: number;
  reported_at: string;
  status: string;
  port_code: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Ship {
  id: string;
  plate_number: string;
  name?: string;
  status: ShipStatus;
  locationcode?: string;
  trackingid?: string;
  length?: number;
  congsuat?: number;
  HoHieu?: string;
  CoHieu?: string;
  IMO?: string;
  TongTaiTrong?: number;
  ChieuRongLonNhat?: number;
  MonNuoc?: number;
  SoThuyenVien?: number;
  NgaySanXuat?: string;
  NgayHetHan?: string;
  DungTichHamCa?: number;
  VanTocDanhBat?: number;
  VanTocHanhTrinh?: number;
  deviceName?: string;
  manufacturer?: string;
  lastmessage?: {
    type: string;
    content?: string;
    report?: boolean;
  };
  lastReport?: ShipLastReport;
}

export interface ShipResponse {
  data: Ship[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface ShipResponseData extends ShipResponse {}
