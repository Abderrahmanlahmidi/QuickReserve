import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('reservations')
@UseGuards(AuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(
    @Body() createReservationDto: CreateReservationDto,
    @GetUser('sub') userId: string,
  ) {
    return this.reservationsService.create(createReservationDto, userId);
  }

  @Get('my-reservations')
  findAllMyReservations(@GetUser('sub') userId: string) {
    return this.reservationsService.findByUserId(userId);
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id/status')
  @Roles('ADMIN')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'CONFIRMED' | 'CANCELED' | 'PENDING',
  ) {
    return this.reservationsService.updateStatus(id, status);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @GetUser('sub') userId: string) {
    return this.reservationsService.cancel(id, userId);
  }
}
