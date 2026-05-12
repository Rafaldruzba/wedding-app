import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PhotosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(eventId: string, url: string, filename?: string) {
    const event = await this.prisma.client.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Nie znaleziono eventu');
    }

    return this.prisma.client.photo.create({
      data: {
        eventId,
        url,
        filename: filename || null,
      },
    });
  }

  async findByEvent(eventId: string) {
    return this.prisma.client.photo.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
