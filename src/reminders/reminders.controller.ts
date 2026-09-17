import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RemindersService } from './reminders.service';

@Controller('reminders')
export class RemindersController {
  constructor(private readonly service: RemindersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: any) {
    return this.service.createReminder(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':patientId')
  async list(@Param('patientId') patientId: string) {
    return this.service.listForPatient(patientId);
  }
}
