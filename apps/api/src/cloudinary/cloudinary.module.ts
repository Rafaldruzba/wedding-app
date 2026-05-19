import { Module, Global, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

/**
 * Global module — configures the Cloudinary SDK once at startup.
 * Import it in AppModule; every other module can just use `cloudinary`
 * directly from 'cloudinary' without re-injecting anything.
 */
@Global()
@Module({})
export class CloudinaryModule implements OnModuleInit {
  private readonly logger = new Logger(CloudinaryModule.name);

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    cloudinary.config({
      cloud_name: this.config.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.getOrThrow<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });

    this.logger.log('Cloudinary configured');
  }
}