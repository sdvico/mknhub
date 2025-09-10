import { User } from '../../users/domain/user';

export interface NestJsRequestType {
  user: {
    id: number | string;
    sessionId: string;
    hash: string;
    email?: string;
    role?: {
      id: number;
    };
  } & Partial<User>;
}
