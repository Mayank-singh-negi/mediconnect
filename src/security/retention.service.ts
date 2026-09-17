import { Injectable } from '@nestjs/common';

@Injectable()
export class RetentionService {
  pruneAuditLogs(logs: any[], maxAgeDays = 365) {
    const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
    return logs.filter((log) => new Date(log.timestamp).getTime() >= cutoff);
  }
}
