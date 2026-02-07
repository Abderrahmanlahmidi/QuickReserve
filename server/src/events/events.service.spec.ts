import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { DRIZZLE } from '../db/drizzle.module';
import { NotFoundException } from '@nestjs/common';

describe('EventsService', () => {
  let service: EventsService;
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
      providers: [EventsService, { provide: DRIZZLE, useValue: mockDb }],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('creates an event with createdBy and Date conversion', async () => {
    const valuesMock = jest.fn().mockReturnValue({
      returning: jest.fn().mockResolvedValue([{ id: 'event-1' }]),
    });

    mockDb.insert.mockReturnValue({ values: valuesMock });

    const result = await service.create(
      {
        title: 'Launch',
        description: 'Product launch',
        date: '2026-01-01T10:00:00.000Z',
        location: 'HQ',
        capacity: 50,
        status: 'PUBLISHED',
        categoryId: 'cat-1',
      },
      'user-1',
    );

    expect(valuesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        createdBy: 'user-1',
        date: expect.any(Date),
      }),
    );
    expect(result).toEqual({ id: 'event-1' });
  });

  it('findOne throws NotFoundException when event is missing', async () => {
    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([]),
        }),
      }),
    });

    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });

  it('update throws NotFoundException when event is missing', async () => {
    mockDb.update.mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([]),
        }),
      }),
    });

    await expect(
      service.update('missing', { title: 'Updated' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove throws NotFoundException when event is missing', async () => {
    mockDb.delete.mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([]),
      }),
    });

    await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
  });

  it('findAll returns events list', async () => {
    mockDb.select.mockReturnValue({
      from: jest.fn().mockResolvedValue([{ id: 'event-1' }]),
    });

    const result = await service.findAll();
    expect(result).toEqual([{ id: 'event-1' }]);
  });
});
