import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {
  private logs: any[] = [];

  log(entry: { userId?: string; action: string; entity?: string; entityId?: string }) {
    const record = {
      id: (this.logs.length + 1).toString(),
      userId: entry.userId ?? 'anonymous',
      action: entry.action,
      entity: entry.entity ?? null,
      entityId: entry.entityId ?? null,
      timestamp: new Date().toISOString(),
    };
    this.logs.push(record);
    return record;
  }

  list() {
    return this.logs.slice();
  }
}
