export class BackupLog {
  id!: string;
  filename!: string;
  userid!: string;
  backupDate!: Date;
  description?: string;
  isActive!: boolean;

  constructor(partial?: Partial<BackupLog>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
