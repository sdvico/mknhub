export interface IOrderChart {
  count: number;
  status:
    | "waiting"
    | "ready"
    | "on the way"
    | "delivered"
    | "could not be delivered";
}

export interface IOrderTotalCount {
  total: number;
  totalDelivered: number;
}

export interface ISalesChart {
  date: string;
  title: "Order Count" | "Order Amount";
  value: number;
}

export interface IOrderStatus {
  id: number;
  text: "Pending" | "Ready" | "On The Way" | "Delivered" | "Cancelled";
}

export interface IUser {
  id: string;
  username: string;
  fullname: string;
  phone: string;
  state: number;
  enable?: boolean;
  verified?: boolean;
  agent_code?: string;
}

export interface IIdentity {
  id: number;
  name: string;
  avatar: string;
}

export interface IAddress {
  text: string;
  coordinate: [string | number, string | number];
}

export interface IFile {
  lastModified?: number;
  name: string;
  percent?: number;
  size: number;
  status?: "error" | "success" | "done" | "uploading" | "removed";
  type: string;
  uid?: string;
  url: string;
}

export interface IEvent {
  date: string;
  status: string;
}

export interface IStore {
  id: number;
  gsm: string;
  email: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  address: IAddress;
  products: IProduct[];
}

export interface IOrder {
  id: number;
  user: IUser;
  createdAt: string;
  products: IProduct[];
  status: IOrderStatus;
  adress: IAddress;
  store: IStore;
  courier: ICourier;
  events: IEvent[];
  orderNumber: number;
  amount: number;
}

export interface IProduct {
  id: number;
  name: string;
  isActive: boolean;
  description: string;
  images: (IFile & { thumbnailUrl?: string })[];
  createdAt: string;
  price: number;
  category: ICategory;
  stock: number;
}

export interface ICategory {
  id: number;
  title: string;
  isActive: boolean;
}

export interface IOrderFilterVariables {
  q?: string;
  store?: string;
  user?: string;
  status?: string[];
}

export interface IUserFilterVariables {
  q?: string;
  phone?: string;
  username?: string;
}

export interface ICourierStatus {
  id: number;
  text: "Available" | "Offline" | "On delivery";
}

export interface ICourier {
  id: number;
  name: string;
  surname: string;
  email: string;
  gender: string;
  gsm: string;
  createdAt: string;
  accountNumber: string;
  licensePlate: string;
  address: string;
  avatar: IFile[];
  store: IStore;
  status: ICourierStatus;
  vehicle: IVehicle;
}

export interface IReview {
  id: number;
  order: IOrder;
  user: IUser;
  star: number;
  createDate: string;
  status: "pending" | "approved" | "rejected";
  comment: string[];
}

export interface ITrendingProducts {
  id: number;
  product: IProduct;
  orderCount: number;
}

export type IVehicle = {
  model: string;
  vehicleType: string;
  engineSize: number;
  color: string;
  year: number;
  id: number;
};

export interface IDevice {
  id: string;
  imei: string;
  name?: string;
  status?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  // Additional properties for extended device information
  plateNumber?: string;
  shipName?: string;
  deviceStatus?: string;
  dataStatus?: string;
  expiryDate?: string | null;
  packageName?: string | null;
  packageDuration?: number | null;
  currentFee?: number | null;
}

export interface IPlan {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ISubscription {
  id: string;
  deviceId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  isLatest: boolean;
  topupId?: string;
  createdAt: string;
  updatedAt: string;
  device?: IDevice;
  plan?: IPlan;
}

export interface ITopUp {
  id: string;
  amount: number;
  status: "CREATED" | "PAID" | "FAILED" | "CANCELLED";
  createdAt: string;
  note: string;
  deviceId?: string;
  userId?: string;
  planId?: string;
  paymentId?: string;
  subscriptionId?: string;
  imei?: string; // For create form
  device?: IDevice;
  plan?: IPlan;
}

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type FeedbackStatus = "new" | "in_progress" | "resolved";

export interface IFeedback {
  id: string;
  content: string;
  reporter_id: string;
  status: FeedbackStatus;
  created_at: string;
  updated_at: string;
  reporter?: {
    id: string;
    username?: string;
    fullname?: string;
    phone?: string;
  } | null;
}

export type ReportStatus = "pending" | "approved" | "rejected";

export interface IReport {
  id: string;
  lat: number;
  lng: number;
  reported_at: string;
  status: ReportStatus;
  reporter_user_id?: string | null;
  reporter_ship_id?: string | null;
  port_code?: string | null;
  description?: string | null;
  source?: string | null;
  created_at: string;
  updated_at: string;
  reporter_user?: {
    id: string;
    username?: string;
    fullname?: string;
    phone?: string;
  } | null;
  reporter_ship?: {
    id: string;
    plate_number?: string;
    name?: string;
    HoHieu?: string;
  } | null;
  ship_notifications?: Array<{
    id: string;
    ship_code: string;
    occurred_at: string;
    content: string;
    owner_name?: string;
    owner_phone?: string;
    type?: string;
    status?: string;
    created_at?: string;
    updated_at?: string;
  }>;
}
