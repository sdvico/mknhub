export class Notification {
  id!: string;
  plateNumber?: string;
  user?: string;
  title?: string;
  content?: string;
  type?: string;
  created_at!: Date;
  create_by!: string;
  update_at!: Date;
  update_by!: string;
  status!: number;
  stype?: string;
  data?: string;

  constructor(partial?: Partial<Notification>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
