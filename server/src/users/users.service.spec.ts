import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { DRIZZLE } from '../db/drizzle.module';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let mockDb: {
    select: jest.Mock;
    insert: jest.Mock;
  };
  let mockJwtService: Pick<JwtService, 'signAsync' | 'verifyAsync'>;

  const bcryptMock = bcrypt as unknown as {
    genSalt: jest.Mock;
    hash: jest.Mock;
    compare: jest.Mock;
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockDb = {
      select: jest.fn(),
      insert: jest.fn(),
    };

    mockJwtService = {
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

  it('register throws ConflictException when email already exists', async () => {
    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([{ id: 'existing' }]),
        }),
      }),
    });

    await expect(
      service.register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password1',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('register throws InternalServerErrorException when role is missing', async () => {
    mockDb.select
      .mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      })
      .mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

    await expect(
      service.register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password1',
      }),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('register returns created user payload', async () => {
    mockDb.select
      .mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      })
      .mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([{ id: 'role-1' }]),
          }),
        }),
      });

    const valuesMock = jest.fn().mockReturnValue({
      returning: jest.fn().mockResolvedValue([
        {
          id: 'user-1',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      ]),
    });

    mockDb.insert.mockReturnValue({ values: valuesMock });

    bcryptMock.genSalt.mockResolvedValue('salt');
    bcryptMock.hash.mockResolvedValue('hashed-password');

    const result = await service.register({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Password1',
    });

    expect(valuesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'john@example.com',
        password: 'hashed-password',
        roleId: 'role-1',
      }),
    );
    expect(result.user).toEqual(
      expect.objectContaining({
        id: 'user-1',
        email: 'john@example.com',
      }),
    );
  });

  it('login throws UnauthorizedException when user is not found', async () => {
    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]),
    });

    await expect(
      service.login({ email: 'missing@example.com', password: 'Password1' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('login throws UnauthorizedException when password is invalid', async () => {
    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([
        {
          id: 'user-1',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'hashed-password',
          role: 'PARTICIPANT',
        },
      ]),
    });

    bcryptMock.compare.mockResolvedValue(false);

    await expect(
      service.login({ email: 'john@example.com', password: 'Password1' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('login returns token and user info when credentials are valid', async () => {
    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([
        {
          id: 'user-1',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'hashed-password',
          role: 'ADMIN',
        },
      ]),
    });

    bcryptMock.compare.mockResolvedValue(true);
    (mockJwtService.signAsync as jest.Mock).mockResolvedValue('jwt-token');

    const result = await service.login({
      email: 'john@example.com',
      password: 'Password1',
    });

    expect(result).toEqual(
      expect.objectContaining({
        access_token: 'jwt-token',
        user: expect.objectContaining({
          id: 'user-1',
          role: 'ADMIN',
        }),
      }),
    );
  });
});
