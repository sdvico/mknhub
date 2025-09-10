export class Agency {
  id?: string;
  name: string;
  code: string;
  created_at?: Date;
  updated_at?: Date;

  constructor(partial: Partial<Agency>) {
    Object.assign(this, partial);
  }
}
