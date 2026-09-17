import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { PrescriptionsService } from './prescriptions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly svc: PrescriptionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreatePrescriptionDto) {
    return this.svc.createPrescription({ ...dto, items: dto.items } as any);
  }
}
