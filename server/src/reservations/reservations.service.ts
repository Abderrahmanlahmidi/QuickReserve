import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DRIZZLE } from '../db/drizzle.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  async create(createReservationDto: CreateReservationDto, userId: string) {
    const { eventId } = createReservationDto;

    const [event] = await this.db
      .select()
      .from(schema.events)
      .where(eq(schema.events.id, eventId))
      .limit(1);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.status !== 'PUBLISHED') {
      throw new BadRequestException('Cannot reserve for this event');
    }

    // 2. Check if user already has an active reservation (PENDING or CONFIRMED)
    const activeReservations = await this.db
      .select()
      .from(schema.reservations)
      .where(
        and(
          eq(schema.reservations.userId, userId),
          eq(schema.reservations.eventId, eventId),
        ),
      );

    const alreadyReserved = activeReservations.some(
      (r) => r.status === 'PENDING' || r.status === 'CONFIRMED',
    );

    if (alreadyReserved) {
      throw new ConflictException(
        'You already have an active reservation for this event',
      );
    }

    // 3. Check capacity against CONFIRMED + PENDING to be safe
    const reservations = await this.db
      .select({
        id: schema.reservations.id,
        status: schema.reservations.status,
      })
      .from(schema.reservations)
      .where(eq(schema.reservations.eventId, eventId));

    const activeCount = reservations.filter(
      (r) => r.status === 'CONFIRMED' || r.status === 'PENDING',
    ).length;

    if (activeCount >= event.capacity) {
      throw new BadRequestException('Event is full');
    }

    // 4. Create reservation
    const [reservation] = await this.db
      .insert(schema.reservations)
      .values({
        userId,
        eventId,
        status: 'PENDING',
      })
      .returning();

    return reservation;
  }

  async findAll() {
    return await this.db
      .select({
        id: schema.reservations.id,
        status: schema.reservations.status,
        user: {
          id: schema.users.id,
          firstName: schema.users.firstName,
          lastName: schema.users.lastName,
          email: schema.users.email,
        },
        event: schema.events,
      })
      .from(schema.reservations)
      .leftJoin(schema.users, eq(schema.reservations.userId, schema.users.id))
      .leftJoin(
        schema.events,
        eq(schema.reservations.eventId, schema.events.id),
      );
  }

  async findByUserId(userId: string) {
    return await this.db
      .select({
        id: schema.reservations.id,
        status: schema.reservations.status,
        event: schema.events,
      })
      .from(schema.reservations)
      .leftJoin(
        schema.events,
        eq(schema.reservations.eventId, schema.events.id),
      )
      .where(eq(schema.reservations.userId, userId));
  }

  async findOne(id: string) {
    const [reservation] = await this.db
      .select()
      .from(schema.reservations)
      .where(eq(schema.reservations.id, id))
      .limit(1);

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    return reservation;
  }

  async updateStatus(id: string, status: 'CONFIRMED' | 'CANCELED' | 'PENDING') {
    const [reservation] = await this.db
      .update(schema.reservations)
      .set({ status })
      .where(eq(schema.reservations.id, id))
      .returning();

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    return reservation;
  }

  async cancel(id: string, userId: string) {
    const [reservation] = await this.db
      .update(schema.reservations)
      .set({ status: 'CANCELED' })
      .where(
        and(
          eq(schema.reservations.id, id),
          eq(schema.reservations.userId, userId),
        ),
      )
      .returning();

    if (!reservation) {
      throw new NotFoundException('Reservation not found or unauthorized');
    }
    return reservation;
  }

  async remove(id: string) {
    const [reservation] = await this.db
      .delete(schema.reservations)
      .where(eq(schema.reservations.id, id))
      .returning();

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    return { message: 'Reservation deleted successfully' };
  }
}
