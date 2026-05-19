import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { PhotosProcessor } from './photos.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'photos',
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 3000 },
      },
    }),
  ],
  controllers: [PhotosController],
  providers: [PhotosService, PhotosProcessor],
})
export class PhotosModule {}