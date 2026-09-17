import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('slots')
export class Slot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  doctorId: string;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'datetime' })
  endTime: Date;

  @Column({ type: 'varchar', default: 'available' })
  status: 'available' | 'booked' | 'cancelled';
}
