import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { DRIZZLE } from '../db/drizzle.module';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const mockDb = {};
    const mockJwtService: Pick<JwtService, 'signAsync' | 'verifyAsync'> = {
      signAsync: jest.fn(() => Promise.resolve('test-token')),
      verifyAsync: jest.fn(() =>
        Promise.resolve({
          sub: 'test-user-id',
          email: 'test@example.com',
          role: 'PARTICIPANT',
        }),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: DRIZZLE, useValue: mockDb },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
