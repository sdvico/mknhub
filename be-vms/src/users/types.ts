import { User } from './domain/user';

export interface FindAllUsersOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  username?: string;
}

export interface FindUsersWithPaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  q?: string;
  keySearch?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface FindAllUsersResult {
  data: User[];
  total: number;
}
