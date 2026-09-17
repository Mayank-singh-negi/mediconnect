import { DataSourceOptions } from 'typeorm';
import { User } from './entities/user.entity';
import { Patient } from './entities/patient.entity';
import { Doctor } from './entities/doctor.entity';
import { Clinic } from './entities/clinic.entity';
import { Slot } from './entities/slot.entity';
import { Appointment } from './entities/appointment.entity';
import { Prescription } from './entities/prescription.entity';
import { PrescriptionItem } from './entities/prescription-item.entity';
import { MedicalRecord } from './entities/medical-record.entity';
import { RecordEmbedding } from './entities/record-embedding.entity';
import { RecordAccessLog } from './entities/record-access-log.entity';
import { Reminder } from './entities/reminder.entity';
import { Notification } from './entities/notification.entity';
import { AuditLog } from './entities/audit-log.entity';

const useSqlite = process.env.DB_TYPE === 'sqlite' || !process.env.DB_HOST;

const config: DataSourceOptions = useSqlite
  ? {
      type: 'sqlite',
      database: process.env.SQLITE_DB_PATH ?? 'mediconnect.sqlite',
      entities: [
        User,
        Patient,
        Doctor,
        Clinic,
        Slot,
        Appointment,
        Prescription,
        PrescriptionItem,
        MedicalRecord,
        RecordEmbedding,
        RecordAccessLog,
        Reminder,
        Notification,
        AuditLog,
      ],
      synchronize: true,
    }
  : {
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'mediconnect',
      entities: [
        User,
        Patient,
        Doctor,
        Clinic,
        Slot,
        Appointment,
        Prescription,
        PrescriptionItem,
        MedicalRecord,
        RecordEmbedding,
        RecordAccessLog,
        Reminder,
        Notification,
        AuditLog,
      ],
      synchronize: true,
    };

export default config;
