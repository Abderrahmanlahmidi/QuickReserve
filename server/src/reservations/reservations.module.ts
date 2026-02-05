import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DrizzleModule } from '../db/drizzle.module';

@Module({
    imports: [DrizzleModule],
    controllers: [ReservationsController],
    providers: [ReservationsService],
})
export class ReservationsModule { }
