import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DrizzleModule } from './db/drizzle.module';
import { EventsModule } from './events/events.module';
import { CategoriesController } from './categories/categories.controller';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [UsersModule, DrizzleModule, EventsModule, ReservationsModule],
  controllers: [AppController, CategoriesController],
  providers: [AppService],
})
export class AppModule {}
