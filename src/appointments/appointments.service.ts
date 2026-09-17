import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { Slot } from '../entities/slot.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment) private readonly appointmentsRepo: Repository<Appointment>,
    @InjectRepository(Slot) private readonly slotsRepo: Repository<Slot>,
    private dataSource: DataSource,
  ) {}

  async create({ patientId, doctorId, slotId, reason }: { patientId: string; doctorId: string; slotId: string; reason?: string }) {
    // Transactional booking: lock slot row and create appointment
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const slot = await queryRunner.manager.findOne(Slot, { where: { id: slotId }, lock: { mode: 'pessimistic_write' } });
      if (!slot) throw new NotFoundException('Slot not found');
      if (slot.status !== 'available') throw new ConflictException('Slot not available');

      // mark slot as booked
      slot.status = 'booked';
      await queryRunner.manager.save(slot);

      const appointment = queryRunner.manager.create(Appointment, {
        id: uuidv4(),
        patientId,
        doctorId,
        slotId,
        status: 'confirmed',
        reason: reason ?? null,
      });

      await queryRunner.manager.save(appointment);

      await queryRunner.commitTransaction();
      return appointment;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getMine(userId: string, role: 'patient' | 'doctor' | 'admin') {
    if (role === 'patient') {
      return this.appointmentsRepo.find({ where: { patientId: userId } });
    }
    if (role === 'doctor') {
      return this.appointmentsRepo.find({ where: { doctorId: userId } });
    }
    return this.appointmentsRepo.find();
  }

  async cancel(id: string, userId?: string, role?: 'patient' | 'doctor' | 'admin') {
    const appointment = await this.appointmentsRepo.findOne({ where: { id } });
    if (!appointment) throw new NotFoundException('Appointment not found');
    if (role && userId && appointment.patientId !== userId && appointment.doctorId !== userId) {
      throw new NotFoundException('Appointment not found');
    }
    appointment.status = 'cancelled';
    return this.appointmentsRepo.save(appointment);
  }
}
