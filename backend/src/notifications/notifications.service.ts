import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notifications } from '../entities/Notifications';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private notificationsRepo: Repository<Notifications>,
  ) {}

  findAll(patientAccountId: number) {
    return this.notificationsRepo.find({
      where: { patientAccountId },
      order: { createdAt: 'DESC' },
      take: 20,
    });
  }

  async markAsRead(id: number) {
    await this.notificationsRepo.update(id, { isRead: true });
    return { success: true };
  }

  async markAllAsRead(patientAccountId: number) {
    await this.notificationsRepo.update({ patientAccountId }, { isRead: true });
    return { success: true };
  }

  async create(patientAccountId: number, title: string, content: string) {
    const notification = this.notificationsRepo.create({ patientAccountId, title, content, isRead: false });
    return this.notificationsRepo.save(notification);
  }
}
