import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const header = req.headers.authorization;

    if (!header || typeof header !== 'string' || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid bearer token');
    }

    const token = header.replace('Bearer ', '');
    try {
      const secret = process.env.JWT_SECRET ?? 'development-secret';
      const payload = jwt.verify(token, secret) as any;
      req.user = { id: payload.sub ?? payload.userId, role: payload.role };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
