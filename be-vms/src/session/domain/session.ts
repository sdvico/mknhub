import { User } from '../../users/domain/user';

export class Session {
  id: string;
  userid: string;
  token: string;
  created_date: Date;
  expired_date: Date;
  user?: User;
}
