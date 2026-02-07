import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { DRIZZLE } from '../db/drizzle.module';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const mockDb = {};
    const mockJwtService: Pick<JwtService, 'signAsync' | 'verifyAsync'> = {
      signAsync: jest.fn(async () => 'test-token'),
      verifyAsync: jest.fn(async () => ({
        sub: 'test-user-id',
        email: 'test@example.com',
        role: 'PARTICIPANT',
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: DRIZZLE, useValue: mockDb },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
