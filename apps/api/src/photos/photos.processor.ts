import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';

export interface PhotoJobData {
  photoId: string;
  localPath: string;
  eventId: string;
  folder: string;
}

@Processor('photos')
export class PhotosProcessor {
  private readonly logger = new Logger(PhotosProcessor.name);

  constructor(private readonly prisma: PrismaService) {}

  @Process('upload-to-cloudinary')
  async handleUpload(job: Job<PhotoJobData>) {
    const { photoId, localPath, eventId, folder } = job.data;

    this.logger.log(`Processing photo ${photoId} for event ${eventId}`);

    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(localPath, {
        folder,
        resource_type: 'image',
        // Optional transformations applied at upload time
        transformation: [{ quality: 'auto:good' }, { fetch_format: 'auto' }],
      });

      // Update the photo record with the Cloudinary URL and public_id
      await this.prisma.client.photo.update({
        where: { id: photoId },
        data: {
          url: result.secure_url,
          cloudinaryId: result.public_id,
          status: 'DONE',
        },
      });

      this.logger.log(
        `Photo ${photoId} uploaded to Cloudinary: ${result.secure_url}`,
      );

      // Clean up temp file
      if (existsSync(localPath)) {
        await unlink(localPath);
        this.logger.log(`Deleted temp file: ${localPath}`);
      }

      return { url: result.secure_url, publicId: result.public_id };
    } catch (err) {
      this.logger.error(`Failed to process photo ${photoId}`, err);

      // Mark photo as failed so the client can react
      await this.prisma.client.photo.update({
        where: { id: photoId },
        data: { status: 'FAILED' },
      });

      throw err; // Bull will retry based on queue config
    }
  }
}
