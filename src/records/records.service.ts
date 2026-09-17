import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MedicalRecord } from '../entities/medical-record.entity';
import { RecordAccessLog } from '../entities/record-access-log.entity';
import { Appointment } from '../entities/appointment.entity';
import { RecordProcessingProcessor } from './processors/record-processing.processor';
import { RecordProcessingQueue } from './record-processing.queue';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly recordsRepo: Repository<MedicalRecord>,
    private readonly processor: RecordProcessingProcessor,
    private readonly queue: RecordProcessingQueue,
    @InjectRepository(RecordAccessLog)
    private readonly accessLogRepo: Repository<RecordAccessLog>,
    private readonly dataSource: DataSource,
  ) {}

  async createRecord(payload: Partial<MedicalRecord>) {
    const rec = this.recordsRepo.create(payload as any);
    const saved = await this.recordsRepo.save(rec as any);

    try {
      const ok = await this.queue.enqueue({
        id: (saved as any).id,
        patientId: (saved as any).patientId,
        fileUrl: (saved as any).fileUrl,
        extractedText: (saved as any).extractedText,
      });

      if (!ok) {
        await this.processor.process({
          id: (saved as any).id,
          patientId: (saved as any).patientId,
          fileUrl: (saved as any).fileUrl,
          extractedText: (saved as any).extractedText,
        });
      }
    } catch {
      await this.processor.process({
        id: (saved as any).id,
        patientId: (saved as any).patientId,
        fileUrl: (saved as any).fileUrl,
        extractedText: (saved as any).extractedText,
      });
    }

    return saved;
  }

  async getRecordForDoctor(doctorId: string, recordId: string) {
    const record = await this.recordsRepo.findOne({ where: { id: recordId } as any });
    if (!record) {
      throw new NotFoundException('Record not found');
    }

    const hasValidAppointment = await this.dataSource.getRepository(Appointment).findOne({
      where: { doctorId, patientId: record.patientId },
    });

    if (!hasValidAppointment) {
      throw new ForbiddenException('Doctor is not authorized to access this patient record');
    }

    const log = this.accessLogRepo.create({
      recordId: record.id,
      accessedByDoctorId: doctorId,
      accessReason: 'doctor_view_patient_record',
    });
    await this.accessLogRepo.save(log as any);

    return record;
  }
}
