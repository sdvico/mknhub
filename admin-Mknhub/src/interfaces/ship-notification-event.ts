export interface IShipNotificationEvent {
  id: string;
  ship_code: string;
  user_report_time?: Date | null;
  type?: string | null;
  started_at?: Date | null;
  resolved_at?: Date | null;
  response_minutes_from_6h?: number | null;
  created_at: Date;
  updated_at: Date;
  duration_minutes?: number;
  is_resolved: boolean;
}

export interface IShipNotificationEventListResponse {
  data: IShipNotificationEvent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IShipNotificationEventFilterVariables {
  ship_code?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}
