import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { DrizzleModule } from '../db/drizzle.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [DrizzleModule, JwtModule],
    controllers: [EventsController],
    providers: [EventsService],
})
export class EventsModule { }
