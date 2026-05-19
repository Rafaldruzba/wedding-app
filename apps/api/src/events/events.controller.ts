import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuardService } from '../auth/auth-guard.service';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly authGuard: AuthGuardService,
  ) {}

  @Post()
  create(@Body() dto: CreateEventDto, @Request() req: any) {
    const user = this.authGuard.verifyToken(req.headers.authorization);
    return this.eventsService.create(dto, user.sub);
  }

  @Get()
  findAll(@Request() req: any) {
    const user = this.authGuard.verifyToken(req.headers.authorization);
    return this.eventsService.findAll(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const user = this.authGuard.verifyToken(req.headers.authorization);
    return this.eventsService.findOne(id, user.sub);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.eventsService.findBySlug(slug);
  }
}
