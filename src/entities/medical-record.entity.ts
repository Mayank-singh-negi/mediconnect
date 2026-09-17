import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @Column({ type: 'varchar' })
  uploadedBy: 'patient' | 'doctor';

  @Column({ type: 'varchar' })
  source: string;

  @Column()
  fileUrl: string;

  @Column({ type: 'varchar', nullable: true })
  recordType: string;

  @Column({ nullable: true })
  conditionTag: string;

  @Column({ nullable: true })
  externalDoctorName: string;

  @Column({ nullable: true })
  externalHospitalName: string;

  @Column({ nullable: true })
  visitDate: string;

  @Column({ type: 'text', nullable: true })
  extractedText: string;

  @CreateDateColumn()
  createdAt: Date;
}
