import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../db/drizzle.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) { }

  async create(createEventDto: CreateEventDto, userId: string) {
    const [event] = await this.db
      .insert(schema.events)
      .values({
        ...createEventDto,
        date: new Date(createEventDto.date),
        createdBy: userId,
      })
      .returning();
    return event;
  }

  async findAll() {
    return await this.db.select().from(schema.events);
  }

  async findAllByCreator(userId: string) {
    return await this.db
      .select()
      .from(schema.events)
      .where(eq(schema.events.createdBy, userId));
  }

  async findOne(id: string) {
    const [event] = await this.db
      .select()
      .from(schema.events)
      .where(eq(schema.events.id, id))
      .limit(1);

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const values: any = { ...updateEventDto };
    if (updateEventDto.date) {
      values.date = new Date(updateEventDto.date);
    }

    const [event] = await this.db
      .update(schema.events)
      .set(values)
      .where(eq(schema.events.id, id))
      .returning();

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async remove(id: string) {
    const [event] = await this.db
      .delete(schema.events)
      .where(eq(schema.events.id, id))
      .returning();

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return { message: 'Event deleted successfully' };
  }
}
