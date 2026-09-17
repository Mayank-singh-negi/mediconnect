import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ConsentService } from './consent.service';
import { RetentionService } from './retention.service';

@Controller('security')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SecurityController {
  constructor(
    private readonly consentService: ConsentService,
    private readonly retentionService: RetentionService,
  ) {}

  @Post('consent')
  @Roles('patient', 'doctor', 'admin')
  grantConsent(@Request() req: any, @Body() body: { scope: string[] }) {
    return this.consentService.grantConsent(req.user.id, body.scope ?? []);
  }

  @Get('consent/:userId')
  @Roles('admin', 'doctor')
  getConsent(@Param('userId') userId: string) {
    return this.consentService.hasConsent(userId, 'records');
  }

  @Post('retention/prune')
  @Roles('admin')
  pruneLogs(@Body() body: { logs: any[]; maxAgeDays?: number }) {
    return this.retentionService.pruneAuditLogs(body.logs ?? [], body.maxAgeDays ?? 365);
  }
}
