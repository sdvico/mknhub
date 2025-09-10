export type ShipStatus =
  | "DISCONNECTED"
  | "CONNECTED"
  | "POSITION_DECLARED"
  | "ACTIVE"
  | "INACTIVE";

export interface IReportLight {
  id: string;
  lat: number;
  lng: number;
  reported_at: string;
  status: string;
  port_code?: string | null;
  description?: string;
  created_at: string;
  updated_at: string;
  source?: string;
}

export interface IShipNotificationLight {
  id: string;
  clientReq: string;
  requestId: string;
  ship_code: string;
  occurred_at: string;
  content: string;
  owner_name: string;
  owner_phone: string;
  type: string;
  status: string;
  boundary_crossed: boolean;
  boundary_near_warning: boolean;
  boundary_status_code?: string | null;
  created_at: string;
  updated_at: string;
  report?: IReportLight;
}

export interface IShip {
  id: string;
  plate_number: string;
  name?: string;
  status: ShipStatus;
  ownerphone?: string;
  state: number;
  lastReport?: IReportLight;
  lastmessage?: IShipNotificationLight;
  unresolved_events?: any[];
}
