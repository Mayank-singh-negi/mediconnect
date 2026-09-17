import { Controller, Post, UseGuards, UploadedFile, UseInterceptors, Body, Get, Param, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { RecordsService } from './records.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('records')
export class RecordsController {
  constructor(private readonly svc: RecordsService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => cb(null, `${Date.now()}-${uuidv4()}-${file.originalname}`),
    }),
  }))
  @Post('upload')
  async upload(@Req() req: any, @UploadedFile() file: any, @Body() body: any) {
    const patientId = body.patientId ?? req.user.id;
    const uploadedBy = body.uploadedBy ?? req.user.role;
    return this.svc.createRecord({ patientId, uploadedBy, source: file.mimetype, fileUrl: file.path });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/doctor-view')
  async getForDoctor(@Req() req: any, @Param('id') id: string) {
    return this.svc.getRecordForDoctor(req.user.id, id);
  }
}
