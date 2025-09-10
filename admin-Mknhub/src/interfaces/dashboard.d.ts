export interface IRecentNotification {
  id: string;
  type: string;
  content: string;
  created_at: string;
}

export interface INotificationStatistics {
  total: number;
  totalByType: Record<string, number>;
  totalByStatus: Record<number, number>;
  recentNotifications: IRecentNotification[];
}

export interface IDashboardFilterVariables {
  date_range?: [string, string];
}
