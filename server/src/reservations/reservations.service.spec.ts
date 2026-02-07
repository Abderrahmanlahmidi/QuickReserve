import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { DRIZZLE } from '../db/drizzle.module';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let mockDb: {
    select: jest.Mock;
    insert: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockDb = {
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationsService, { provide: DRIZZLE, useValue: mockDb }],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  it('create throws NotFoundException when event is missing', async () => {
    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([]),
        }),
      }),
    });

    await expect(
      service.create({ eventId: 'event-1' }, 'user-1'),
    ).rejects.toThrow(NotFoundException);
  });

  it('create throws BadRequestException when event is not published', async () => {
    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([
            { id: 'event-1', status: 'DRAFT', capacity: 2 },
          ]),
        }),
      }),
    });

    await expect(
      service.create({ eventId: 'event-1' }, 'user-1'),
    ).rejects.toThrow(BadRequestException);
  });

  it('create throws ConflictException when already reserved', async () => {
    mockDb.select
      .mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([
              { id: 'event-1', status: 'PUBLISHED', capacity: 2 },
            ]),
          }),
        }),
      })
      .mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([
            { status: 'PENDING' },
          ]),
        }),
      });

    await expect(
      service.create({ eventId: 'event-1' }, 'user-1'),
    ).rejects.toThrow(ConflictException);
  });

  it('create throws BadRequestException when event is full', async () => {
    mockDb.select
      .mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([
              { id: 'event-1', status: 'PUBLISHED', capacity: 1 },
            ]),
          }),
        }),
      })
      .mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      })
      .mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([
            { status: 'CONFIRMED' },
          ]),
        }),
      });

    await expect(
      service.create({ eventId: 'event-1' }, 'user-1'),
    ).rejects.toThrow(BadRequestException);
  });

  it('create returns reservation when valid', async () => {
    mockDb.select
      .mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([
              { id: 'event-1', status: 'PUBLISHED', capacity: 2 },
            ]),
          }),
        }),
      })
      .mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      })
      .mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([{ status: 'PENDING' }]),
        }),
      });

    mockDb.insert.mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([
          { id: 'res-1', status: 'PENDING' },
        ]),
      }),
    });

    const result = await service.create({ eventId: 'event-1' }, 'user-1');
    expect(result).toEqual({ id: 'res-1', status: 'PENDING' });
  });

  it('updateStatus throws NotFoundException when reservation missing', async () => {
    mockDb.update.mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([]),
        }),
      }),
    });

    await expect(
      service.updateStatus('missing', 'CONFIRMED'),
    ).rejects.toThrow(NotFoundException);
  });

  it('cancel throws NotFoundException when reservation missing', async () => {
    mockDb.update.mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([]),
        }),
      }),
    });

    await expect(service.cancel('missing', 'user-1')).rejects.toThrow(
      NotFoundException,
    );
  });
});
