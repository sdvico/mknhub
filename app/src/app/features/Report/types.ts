import {Ship} from '../Tracking/types';

export enum ReportStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export interface Report {
  id: string;
  description: string;
  lat: number;
  lng: number;
  address?: string;
  reporterId: string;
  reporterName?: string;
  shipId?: string;
  shipName?: string;
  status: ReportStatus;
  reported_at: string;
  updatedAt: string;
  response?: string;
  images?: string[];
  reporter_ship: Ship;
  reporter_user: any;
}

export interface CreateReportDto {
  description: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  reporterId: string;
  reporterName?: string;
  shipId?: string;
  shipName?: string;
  images?: string[];
}

export interface ReportResponse {
  data: Report[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}
