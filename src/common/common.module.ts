import { Module } from '@nestjs/common';
import { AuditLogInterceptor } from './interceptors/audit-log.interceptor';

@Module({
  providers: [AuditLogInterceptor],
  exports: [AuditLogInterceptor],
})
export class CommonModule {}
