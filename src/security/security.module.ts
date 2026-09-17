import { Module } from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';
import { ConsentService } from './consent.service';
import { RetentionService } from './retention.service';
import { SecurityController } from './security.controller';

@Module({
  controllers: [SecurityController],
  providers: [RateLimitService, ConsentService, RetentionService],
  exports: [RateLimitService, ConsentService, RetentionService],
})
export class SecurityModule {}
