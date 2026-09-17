jest.mock('@nestjs/common', () => ({
  Injectable: () => (target: any) => target,
  ForbiddenException: class ForbiddenException extends Error {},
  NotFoundException: class NotFoundException extends Error {},
}));

jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => undefined,
}));

import { ForbiddenException } from '@nestjs/common';
import { RecordsService } from './records.service';

describe('RecordsService access control', () => {
  it('blocks doctors without an appointment for the patient', async () => {
    const recordsRepo = {
      findOne: jest.fn().mockResolvedValue({ id: 'rec-1', patientId: 'patient-1' }),
    };

    const accessRepo = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const dataSource = {
      getRepository: jest.fn(() => ({
        findOne: jest.fn().mockResolvedValue(null),
      })),
    };

    const service = new RecordsService(
      recordsRepo as any,
      { process: jest.fn() } as any,
      { enqueue: jest.fn() } as any,
      accessRepo as any,
      dataSource as any,
    );

    await expect(service.getRecordForDoctor('doctor-1', 'rec-1')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('allows access when the doctor has a valid appointment for the patient', async () => {
    const recordsRepo = {
      findOne: jest.fn().mockResolvedValue({ id: 'rec-1', patientId: 'patient-1' }),
    };

    const accessRepo = {
      create: jest.fn().mockReturnValue({} as any),
      save: jest.fn().mockResolvedValue({ id: 'log-1' }),
    };

    const dataSource = {
      getRepository: jest.fn(() => ({
        findOne: jest.fn().mockResolvedValue({ id: 'appt-1', doctorId: 'doctor-1', patientId: 'patient-1' }),
      })),
    };

    const service = new RecordsService(
      recordsRepo as any,
      { process: jest.fn() } as any,
      { enqueue: jest.fn() } as any,
      accessRepo as any,
      dataSource as any,
    );

    const result = await service.getRecordForDoctor('doctor-1', 'rec-1');
    expect(result).toMatchObject({ id: 'rec-1', patientId: 'patient-1' });
  });
});
