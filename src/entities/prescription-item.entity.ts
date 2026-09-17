import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('prescription_items')
export class PrescriptionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  prescriptionId: string;

  @Column()
  medicineName: string;

  @Column({ nullable: true })
  dosage: string;

  @Column({ type: 'simple-array', nullable: true })
  timing: string[];

  @Column({ nullable: true })
  foodInstruction: string;

  @Column({ nullable: true })
  durationDays: number;
}
