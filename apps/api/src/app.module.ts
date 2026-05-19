import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { BullModule } from '@nestjs/bull';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { PhotosModule } from './photos/photos.module';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
 
    // Serve only temp uploads (Cloudinary handles permanent storage)
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
 
    // Register Bull globally with Redis connection from env
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get('REDIS_PASSWORD'),
          tls: config.get('REDIS_TLS') === 'true' ? {} : undefined,
        },
      }),
    }),
 
    PrismaModule,
    CloudinaryModule,
    AuthModule,
    EventsModule,
    PhotosModule,
  ],
})
export class AppModule {}