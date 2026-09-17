import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  appointmentId: string;

  @Column('uuid')
  doctorId: string;

  @Column('uuid')
  patientId: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  followUpDate: string;

  @CreateDateColumn()
  createdAt: Date;
}
