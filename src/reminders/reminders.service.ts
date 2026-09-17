import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder } from '../entities/reminder.entity';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder)
    private readonly remindersRepo: Repository<Reminder>,
  ) {}

  async createReminder(payload: Partial<Reminder>) {
    const reminder = this.remindersRepo.create(payload as any);
    return this.remindersRepo.save(reminder as any);
  }

  async listForPatient(patientId: string) {
    return this.remindersRepo.find({ where: { patientId } as any });
  }

  async markSent(id: string) {
    const reminder = await this.remindersRepo.findOne({ where: { id } as any });
    if (!reminder) throw new NotFoundException('Reminder not found');
    reminder.status = 'sent';
    return this.remindersRepo.save(reminder);
  }
}
