import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Event } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  private slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/\-+/g, '-');
  }

  async create(dto: CreateEventDto, userId?: string | null): Promise<Event> {
    const baseSlug = dto.slug?.trim() || this.slugify(dto.name);
    let slug = baseSlug || `event-${Date.now()}`;

    const existing = await this.prisma.client.event.findUnique({
      where: { slug },
    });

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    return this.prisma.client.event.create({
      data: {
        name: dto.name,
        slug,
        date: dto.date ? new Date(dto.date) : null,
        userId: userId || null,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.client.event.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        photos: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const event = await this.prisma.client.event.findFirst({
      where: { id, userId },
      include: { photos: true },
    });

    if (!event) {
      throw new NotFoundException('Nie znaleziono wydarzenia');
    }

    return event;
  }

  async findBySlug(slug: string) {
    const event = await this.prisma.client.event.findUnique({
      where: { slug },
      include: { photos: true },
    });

    if (!event) {
      throw new NotFoundException('Nie znaleziono wydarzenia');
    }

    return event;
  }
}
