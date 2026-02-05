import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Patch,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) { }

    @Post()
    @UseGuards(AuthGuard)
    create(@Body() createReservationDto: CreateReservationDto, @GetUser('sub') userId: string) {
        return this.reservationsService.create(createReservationDto, userId);
    }

    @Get('my-reservations')
    @UseGuards(AuthGuard)
    findAllMyReservations(@GetUser('sub') userId: string) {
        return this.reservationsService.findByUserId(userId);
    }

    @Get()
    @UseGuards(AuthGuard)
    findAll() {
        return this.reservationsService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    findOne(@Param('id') id: string) {
        return this.reservationsService.findOne(id);
    }

    @Patch(':id/cancel')
    @UseGuards(AuthGuard)
    cancel(@Param('id') id: string, @GetUser('sub') userId: string) {
        return this.reservationsService.cancel(id, userId);
    }
}
