import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({ type: 'varchar' })
  channel: string;

  @Column({ type: 'json', nullable: true })
  payload: any;

  @Column({ type: 'varchar', default: 'queued' })
  status: string;

  @Column({ type: 'datetime', nullable: true })
  sentAt: Date;
}
