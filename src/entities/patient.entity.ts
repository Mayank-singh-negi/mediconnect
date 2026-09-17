import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('patients')
export class Patient {
  @PrimaryColumn('uuid')
  userId: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  dob: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  bloodGroup: string;

  @Column({ nullable: true })
  emergencyContact: string;
}
