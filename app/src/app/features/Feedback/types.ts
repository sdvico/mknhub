export enum FeedbackStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export interface Feedback {
  id: string;
  content: string;
  reporterId: string;
  reporterName?: string;
  status: FeedbackStatus;
  created_at: string;
  updated_at: string;
  response?: string;
}

export interface CreateFeedbackDto {
  content: string;
  reporterId: string;
  reporterName?: string;
}

export interface FeedbackResponse {
  data: Feedback[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}
