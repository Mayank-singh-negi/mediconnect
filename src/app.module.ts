import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditModule } from './audit/audit.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './ormconfig';
import { Appointment } from './entities/appointment.entity';
import { Slot } from './entities/slot.entity';
import { AppointmentsModule } from './appointments/appointments.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { RecordsModule } from './records/records.module';
import { RemindersModule } from './reminders/reminders.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SecurityModule } from './security/security.module';
import { SlotsModule } from './slots/slots.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (config) => {
        if (!config.JWT_SECRET || config.JWT_SECRET.length < 32) {
          throw new Error('JWT_SECRET must be configured with at least 32 characters');
        }
        return config;
      },
    }),
    TypeOrmModule.forRoot(ormconfig),
    AuditModule,
    AiModule,
    AuthModule,
    AppointmentsModule,
    PrescriptionsModule,
    RecordsModule,
    RemindersModule,
    NotificationsModule,
    SecurityModule,
    SlotsModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule {}
