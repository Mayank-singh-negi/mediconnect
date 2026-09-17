import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const method = req.method;
    const url = req.originalUrl || req.url;
    const userId = user?.id ?? null;
    const entity = this.extractEntity(url);
    const entityId = req.params?.id ?? req.body?.id ?? null;

    return next.handle().pipe(
      tap(() => {
        this.auditService.log({
          userId: userId ?? undefined,
          action: `${method} ${url}`,
          entity,
          entityId: entityId ?? undefined,
        });
      }),
      catchError((error) => {
        this.auditService.log({
          userId: userId ?? undefined,
          action: `${method} ${url} failed`,
          entity,
          entityId: entityId ?? undefined,
        });
        throw error;
      }),
    );
  }

  private extractEntity(url: string): string | null {
    const match = url.match(/\/([a-zA-Z-]+)(?:\/|$)/);
    return match ? match[1] : null;
  }
}
