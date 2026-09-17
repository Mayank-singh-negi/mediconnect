import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecord } from '../entities/medical-record.entity';
import { RecordAccessLog } from '../entities/record-access-log.entity';
import { Appointment } from '../entities/appointment.entity';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { RecordProcessingProcessor } from './processors/record-processing.processor';
import { TaggingService } from '../ai/tagging.service';
import { EmbeddingService } from '../ai/embedding.service';
import { VectorStoreService } from '../ai/vector-store.service';
import { RecordProcessingQueue } from './record-processing.queue';
import { RecordProcessingWorker } from './record-processing.worker';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord, RecordAccessLog, Appointment])],
  controllers: [RecordsController],
  providers: [
    RecordsService,
    RecordProcessingProcessor,
    TaggingService,
    EmbeddingService,
    VectorStoreService,
    RecordProcessingQueue,
    RecordProcessingWorker,
  ],
})
export class RecordsModule {}
