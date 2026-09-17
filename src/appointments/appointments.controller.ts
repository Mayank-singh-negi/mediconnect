import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AppointmentsService } from './appointments.service';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('appointments')
  @Roles('patient')
  create(@Request() req: any, @Body() body: { doctorId: string; slotId: string; reason?: string }) {
    return this.appointmentsService.create({
      patientId: req.user.id,
      doctorId: body.doctorId,
      slotId: body.slotId,
      reason: body.reason,
    });
  }

  @Get('appointments/mine')
  @Roles('patient', 'doctor')
  getMine(@Request() req: any) {
    return this.appointmentsService.getMine(req.user.id, req.user.role);
  }

  @Patch('appointments/:id/cancel')
  @Roles('patient', 'doctor')
  cancel(@Request() req: any, @Param('id') id: string) {
    return this.appointmentsService.cancel(id, req.user.id, req.user.role);
  }
}
