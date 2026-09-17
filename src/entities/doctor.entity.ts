import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('doctors')
export class Doctor {
  @PrimaryColumn('uuid')
  userId: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  specialization: string;

  @Column({ nullable: true })
  qualification: string;

  @Column({ unique: true })
  uniqueDoctorId: string;

  @Column({ nullable: true })
  clinicId: string;

  @Column({ nullable: true })
  createdByAdminId: string;
}
