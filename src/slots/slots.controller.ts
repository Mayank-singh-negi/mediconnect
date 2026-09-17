import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { SlotsService } from './slots.service';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post('doctor/slots')
  @Roles('doctor')
  async createSlot(@Request() req: any, @Body() body: { startTime: string; endTime: string }) {
    return this.slotsService.createSlot(req.user.id, new Date(body.startTime), new Date(body.endTime));
  }

  @Get('doctor/slots')
  @Roles('doctor')
  async listDoctorSlots(@Request() req: any) {
    return this.slotsService.listDoctorSlots(req.user.id);
  }

  @Get('patients/doctors/:doctorId/slots')
  @Roles('patient')
  async getAvailableSlotsForDoctor(@Param('doctorId') doctorId: string) {
    return this.slotsService.getAvailableSlotsForDoctor(doctorId);
  }
}
