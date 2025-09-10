export interface WeatherReport {
  id: string;
  region: string;
  summary: string;
  advice?: string;
  link?: string;
  cloud?: string;
  rain?: string;
  wind?: string;
  wave?: string;
  visibility?: string;
  recommendation?: string;
  total_views: number;
  total_clicks: number;
  enable: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface WeatherResponse {
  data: WeatherReport[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}
