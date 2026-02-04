import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DrizzleModule } from 'src/db/drizzle.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DrizzleModule,
    JwtModule.register({
      global: true,
      secret: 'SECRET_KEY_NADI_123',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
