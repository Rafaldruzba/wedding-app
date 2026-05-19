import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Event } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { v2 as cloudinary } from 'cloudinary';

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

  async getDownloadAllPhotosZipUrl(eventId: string): Promise<string> {
    try {
      const event = await this.prisma.client.event.findUnique({
        where: { id: eventId },
      });
      if (!event) {
        throw new NotFoundException(
          `Nie znaleziono wydarzenia o ID: ${eventId}`,
        );
      }

      const eventName = event.name;

      // Dynamics folder where photos are stored (without trailing slash)
      const folderPath = `events/${eventName}-2026`;

      // 1. Searching for all photos in the folder using Cloudinary Search API with asset_folder parameter
      const searchResult = await cloudinary.search
        .expression(`asset_folder:"${folderPath}"`)
        .max_results(500)
        .execute();

      // 2. Mapping all public_ids from search results
      const publicIds = searchResult.resources.map((res: any) => res.public_id);

      if (!publicIds || publicIds.length === 0) {
        throw new NotFoundException(
          `Nie znaleziono zdjęć w folderze: ${folderPath}`,
        );
      }

      // 3. Generating a ZIP download URL using the list of public_ids
      const zipUrl = cloudinary.utils.download_zip_url({
        public_ids: publicIds,
        resource_type: 'image',
        target_public_id: `wesele-${eventId}-${Date.now()}`,
        flatten_folders: true,
      });

      return zipUrl;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      // If cloudinary throws an error
      throw new InternalServerErrorException(
        `Cloudinary error: ${error.message || 'Unknown error'}`,
      );
    }
  }
}
