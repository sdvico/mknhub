export type ShipNotificationType =
  | "NORMAL"
  | "MKN_2H"
  | "MKN_5H"
  | "MKN_6H"
  | "MKN_8D"
  | "MKN_10D"
  | "KNL"
  | "NEAR_BORDER"
  | "CROSS_BORDER";

export type ShipNotificationStatus =
  | "QUEUED"
  | "SENDING"
  | "SENT"
  | "DELIVERED"
  | "FAILED";

export interface IShipNotification {
  // Required fields from DTO
  clientReq: string;
  ship_code: string;
  occurred_at: string;
  content: string;
  owner_name: string;
  owner_phone: string;
  type: ShipNotificationType;

  // Optional fields from DTO
  boundary_crossed?: boolean;
  boundary_near_warning?: boolean;
  boundary_status_code?: string;

  // Additional fields for internal use
  id?: string;
  plateNumber?: string;
  user?: string;
  title?: string;
  created_at?: Date;
  create_by?: string;
  update_at?: Date;
  update_by?: string;
  status?: ShipNotificationStatus;
  requestId?: string;
  formatted_message?: string;
}

export interface IShipNotificationFilterVariables {
  q?: string;
  type?: ShipNotificationType;
  status?: ShipNotificationStatus;
  ship_code?: string;
  owner_phone?: string;
  date_range?: [string, string];
}

export interface IShipNotificationResponse {
  requestId: string;
  clientReq: string;
  status: ShipNotificationStatus;
}

export interface IShipNotificationError {
  statusCode: number;
  message: string;
  error: string;
}

// Status string mapping (align with BE enums)
export const NOTIFICATION_STATUS = {
  QUEUED: "QUEUED",
  SENDING: "SENDING",
  SENT: "SENT",
  DELIVERED: "DELIVERED",
  FAILED: "FAILED",
} as const;
