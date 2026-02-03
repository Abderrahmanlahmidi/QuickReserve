import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DrizzleModule } from './db/drizzle.module';

@Module({
  imports: [UsersModule, DrizzleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
