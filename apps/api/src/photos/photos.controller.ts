import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import type { Request } from 'express';
import { randomUUID } from 'crypto';
import { PhotosService } from './photos.service';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post(':eventId/upload')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const rawEventId = req.params.eventId;
          const eventId = Array.isArray(rawEventId)
            ? rawEventId[0]
            : (rawEventId ?? '');
          const dir = join(process.cwd(), 'uploads', eventId);

          if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
          }

          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.mimetype)) {
          return cb(
            new BadRequestException('Dozwolone tylko JPG, PNG, WEBP') as any,
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 15 * 1024 * 1024,
      },
    }),
  )
  async uploadPhoto(
    @Param('eventId') eventId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('Brak pliku');
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const photoUrl = `${baseUrl}/uploads/${eventId}/${file.filename}`;

    const photo = await this.photosService.create(
      eventId,
      photoUrl,
      file.filename,
    );

    return {
      success: true,
      photo,
    };
  }

  @Get(':eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.photosService.findByEvent(eventId);
  }
}
