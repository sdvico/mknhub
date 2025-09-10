import { Agency } from '../../agencies/domain/agency';

export class User {
  id: string;
  username: string;
  password: string;
  state: number;
  fullname: string;
  phone: string;
  verified: boolean;
  enable: boolean;
  agency_id?: string;
  agency?: Agency;
  agent_code?: string;
}
