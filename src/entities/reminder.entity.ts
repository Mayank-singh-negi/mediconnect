import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('reminders')
export class Reminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @Column({ type: 'varchar' })
  type: 'medicine' | 'follow_up';

  @Column('uuid')
  sourceId: string;

  @Column({ type: 'datetime' })
  scheduledTime: Date;

  @Column({ type: 'varchar', default: 'pending' })
  status: 'pending' | 'sent' | 'failed' | 'acknowledged';
}
