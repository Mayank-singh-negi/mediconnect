import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Prescription } from '../entities/prescription.entity';
import { PrescriptionItem } from '../entities/prescription-item.entity';

@Injectable()
export class PrescriptionsService {
  constructor(private dataSource: DataSource) {}

  async createPrescription(payload: Partial<Prescription> & { items: Partial<PrescriptionItem>[] }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const prescription = queryRunner.manager.create(Prescription, {
        appointmentId: payload.appointmentId,
        doctorId: payload.doctorId,
        patientId: payload.patientId,
        notes: payload.notes,
        followUpDate: payload.followUpDate,
      } as any);

      const saved = await queryRunner.manager.save(prescription as any);

      for (const it of payload.items || []) {
        const pi = queryRunner.manager.create(PrescriptionItem, {
          prescriptionId: (saved as any).id,
          medicineName: it.medicineName,
          dosage: it.dosage,
          timing: it.timing,
          foodInstruction: it.foodInstruction,
          durationDays: it.durationDays,
        } as any);
        await queryRunner.manager.save(pi as any);
      }

      await queryRunner.commitTransaction();
      return saved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
