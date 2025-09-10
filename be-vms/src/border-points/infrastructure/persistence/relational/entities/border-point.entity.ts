import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('BorderPoints')
@Index('IDX_BorderPoints_lat_lng', ['lat', 'lng'])
export class BorderPointEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'float' })
  lat!: number;

  @Column({ type: 'float' })
  lng!: number;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  note?: string | null;
}
