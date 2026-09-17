import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('record_access_logs')
export class RecordAccessLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  recordId: string;

  @Column('uuid')
  accessedByDoctorId: string;

  @CreateDateColumn()
  accessedAt: Date;

  @Column({ nullable: true })
  accessReason: string;
}
