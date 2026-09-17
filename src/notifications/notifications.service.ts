import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
  ) {}

  async createNotification(payload: Partial<Notification>) {
    const log = this.notificationsRepo.create(payload as any);
    return this.notificationsRepo.save(log as any);
  }

  async markDelivered(id: string) {
    const row = await this.notificationsRepo.findOne({ where: { id } as any });
    if (!row) return null;
    row.status = 'sent';
    row.sentAt = new Date();
    return this.notificationsRepo.save(row);
  }
}
