import {
  INestApplication,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { EventsController } from '../src/events/events.controller';
import { ReservationsController } from '../src/reservations/reservations.controller';
import { EventsService } from '../src/events/events.service';
import { ReservationsService } from '../src/reservations/reservations.service';
import { AuthGuard } from '../src/auth/guards/auth.guard';
import { RolesGuard } from '../src/auth/guards/roles.guard';

type EventRecord = {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  capacity: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELED';
  categoryId?: string;
  createdBy: string;
};

type ReservationRecord = {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
  eventId: string;
  userId: string;
};

class TestStore {
  events: EventRecord[] = [];
  reservations: ReservationRecord[] = [];
  private eventSeq = 1;
  private reservationSeq = 1;

  nextEventId() {
    return `event-${this.eventSeq++}`;
  }

  nextReservationId() {
    return `res-${this.reservationSeq++}`;
  }
}

@Injectable()
class TestAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'];
    const role = request.headers['x-user-role'];

    if (!userId || !role) {
      return false;
    }

    request.user = { sub: String(userId), role: String(role) };
    return true;
  }
}

@Injectable()
class FakeEventsService {
  constructor(private store: TestStore) {}

  create(dto: any, userId: string) {
    const event: EventRecord = {
      id: this.store.nextEventId(),
      title: dto.title,
      description: dto.description,
      date: dto.date,
      location: dto.location,
      capacity: dto.capacity,
      status: dto.status ?? 'DRAFT',
      categoryId: dto.categoryId,
      createdBy: userId,
    };
    this.store.events.push(event);
    return event;
  }

  findAll() {
    return this.store.events;
  }

  findAllByCreator(userId: string) {
    return this.store.events.filter((event) => event.createdBy === userId);
  }

  findOne(id: string) {
    const event = this.store.events.find((item) => item.id === id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  update(id: string, dto: any) {
    const event = this.store.events.find((item) => item.id === id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    Object.assign(event, dto);
    return event;
  }

  remove(id: string) {
    const index = this.store.events.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    this.store.events.splice(index, 1);
    return { message: 'Event deleted successfully' };
  }
}

@Injectable()
class FakeReservationsService {
  constructor(private store: TestStore) {}

  create(dto: { eventId: string }, userId: string) {
    const event = this.store.events.find((item) => item.id === dto.eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    if (event.status !== 'PUBLISHED') {
      throw new BadRequestException('Cannot reserve for this event');
    }

    const alreadyReserved = this.store.reservations.some(
      (reservation) =>
        reservation.userId === userId &&
        reservation.eventId === dto.eventId &&
        (reservation.status === 'PENDING' ||
          reservation.status === 'CONFIRMED'),
    );

    if (alreadyReserved) {
      throw new ConflictException(
        'You already have an active reservation for this event',
      );
    }

    const activeCount = this.store.reservations.filter(
      (reservation) =>
        reservation.eventId === dto.eventId &&
        (reservation.status === 'PENDING' ||
          reservation.status === 'CONFIRMED'),
    ).length;

    if (activeCount >= event.capacity) {
      throw new BadRequestException('Event is full');
    }

    const reservation: ReservationRecord = {
      id: this.store.nextReservationId(),
      eventId: dto.eventId,
      userId,
      status: 'PENDING',
    };
    this.store.reservations.push(reservation);
    return reservation;
  }

  findAll() {
    return this.store.reservations.map((reservation) => ({
      id: reservation.id,
      status: reservation.status,
      user: { id: reservation.userId },
      event: this.store.events.find(
        (event) => event.id === reservation.eventId,
      ),
    }));
  }

  findByUserId(userId: string) {
    return this.store.reservations
      .filter((reservation) => reservation.userId === userId)
      .map((reservation) => ({
        id: reservation.id,
        status: reservation.status,
        event: this.store.events.find(
          (event) => event.id === reservation.eventId,
        ),
      }));
  }

  updateStatus(id: string, status: 'CONFIRMED' | 'CANCELED' | 'PENDING') {
    const reservation = this.store.reservations.find((item) => item.id === id);
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    reservation.status = status;
    return reservation;
  }

  cancel(id: string, userId: string) {
    const reservation = this.store.reservations.find(
      (item) => item.id === id && item.userId === userId,
    );
    if (!reservation) {
      throw new NotFoundException('Reservation not found or unauthorized');
    }
    reservation.status = 'CANCELED';
    return reservation;
  }
}

describe('Reservations flow (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleBuilder = Test.createTestingModule({
      controllers: [EventsController, ReservationsController],
      providers: [
        TestStore,
        { provide: EventsService, useClass: FakeEventsService },
        { provide: ReservationsService, useClass: FakeReservationsService },
        RolesGuard,
      ],
    })
      .overrideGuard(AuthGuard)
      .useClass(TestAuthGuard);

    const moduleFixture: TestingModule = await moduleBuilder.compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('allows admin to create events, participant to reserve, and admin to confirm', async () => {
    const eventPayload = {
      title: 'Demo Event',
      description: 'Demo',
      date: new Date().toISOString(),
      location: 'Main Hall',
      capacity: 2,
      status: 'PUBLISHED',
      categoryId: 'cat-1',
    };

    const createEventResponse = await request(app.getHttpServer())
      .post('/events')
      .set('x-user-id', 'admin-1')
      .set('x-user-role', 'ADMIN')
      .send(eventPayload)
      .expect(201);

    const eventId = createEventResponse.body.id;

    await request(app.getHttpServer())
      .post('/events')
      .set('x-user-id', 'user-1')
      .set('x-user-role', 'PARTICIPANT')
      .send(eventPayload)
      .expect(403);

    const reservationResponse = await request(app.getHttpServer())
      .post('/reservations')
      .set('x-user-id', 'user-1')
      .set('x-user-role', 'PARTICIPANT')
      .send({ eventId })
      .expect(201);

    const reservationId = reservationResponse.body.id;

    await request(app.getHttpServer())
      .patch(`/reservations/${reservationId}/status`)
      .set('x-user-id', 'admin-1')
      .set('x-user-role', 'ADMIN')
      .send({ status: 'CONFIRMED' })
      .expect(200);

    const myReservationsResponse = await request(app.getHttpServer())
      .get('/reservations/my-reservations')
      .set('x-user-id', 'user-1')
      .set('x-user-role', 'PARTICIPANT')
      .expect(200);

    expect(myReservationsResponse.body[0]).toEqual(
      expect.objectContaining({
        status: 'CONFIRMED',
        event: expect.objectContaining({ id: eventId }),
      }),
    );
  });
});
