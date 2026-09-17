import { Injectable } from '@nestjs/common';

@Injectable()
export class ConsentService {
  private readonly consents = new Map<string, { grantedAt: Date; scope: string[] }>();

  grantConsent(userId: string, scope: string[]) {
    this.consents.set(userId, { grantedAt: new Date(), scope });
    return { userId, scope, grantedAt: new Date() };
  }

  hasConsent(userId: string, scope: string) {
    const consent = this.consents.get(userId);
    return !!consent && consent.scope.includes(scope);
  }
}
