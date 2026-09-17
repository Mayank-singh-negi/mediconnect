import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slot } from '../entities/slot.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SlotsService {
  constructor(@InjectRepository(Slot) private readonly repo: Repository<Slot>) {}

  async createSlot(doctorId: string, startTime: Date, endTime: Date) {
    const slot = this.repo.create({ doctorId, startTime, endTime, status: 'available' });
    return this.repo.save(slot);
  }

  async listDoctorSlots(doctorId: string) {
    return this.repo.find({ where: { doctorId } });
  }

  async getAvailableSlotsForDoctor(doctorId: string) {
    return this.repo.find({ where: { doctorId, status: 'available' } });
  }
}
