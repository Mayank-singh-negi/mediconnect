import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { RateLimitService } from '../security/rate-limit.service';

@Injectable()
export class AuthRateLimitGuard implements CanActivate {
  constructor(private readonly rateLimitService: RateLimitService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const key = req.ip ?? 'unknown';
    const allowed = this.rateLimitService.isAllowed(key, 5, 60_000);

    if (!allowed) {
      throw new ForbiddenException('Too many auth attempts. Please wait and retry later.');
    }

    return true;
  }
}
