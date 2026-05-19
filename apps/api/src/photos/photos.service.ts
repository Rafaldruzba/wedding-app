import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PhotoJobData } from './dto/photoJobData.dto';

@Injectable()
export class PhotosService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('photos') private readonly photosQueue: Queue,
  ) {}

  async enqueueUpload(eventId: string, localPath: string, filename: string) {
    const event = await this.prisma.client.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Nie znaleziono eventu');
    }

    // Placeholder URL until Cloudinary responds
    const photo = await this.prisma.client.photo.create({
      data: {
        eventId,
        url: '', // filled in by the processor
        filename,
        status: 'PENDING',
        cloudinaryId: null,
      },
    });

    const jobData: PhotoJobData = {
      photoId: photo.id,
      localPath,
      eventId,
      folder: `events/${event.slug}`,
    };

    await this.photosQueue.add('upload-to-cloudinary', jobData, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 3000 },
      removeOnComplete: true, // keep redis clean
      removeOnFail: false, // keep failed jobs for debugging
    });

    return photo;
  }

  async findByEvent(eventId: string) {
    return this.prisma.client.photo.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(photoId: string) {
    const photo = await this.prisma.client.photo.findUnique({
      where: { id: photoId },
    });
    if (!photo) {
      throw new NotFoundException('Nie znaleziono zdjęcia');
    }

    return photo;
  }
}
