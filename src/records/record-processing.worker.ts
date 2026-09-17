import { Injectable, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { RecordProcessingProcessor } from './processors/record-processing.processor';
import { RecordProcessingJobData } from './record-processing.queue';

@Injectable()
export class RecordProcessingWorker implements OnModuleInit {
  private worker?: Worker<RecordProcessingJobData>;

  constructor(private readonly processor: RecordProcessingProcessor) {}

  async onModuleInit() {
    if (process.env.USE_REDIS !== 'true') {
      return;
    }

    try {
      const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
        maxRetriesPerRequest: null,
        lazyConnect: true,
      });

      await connection.connect();
      if (connection.status !== 'ready') {
        return;
      }

      this.worker = new Worker<RecordProcessingJobData>('record-processing', async (job) => {
        return this.processor.process(job.data);
      }, { connection });
    } catch {
      // Ignore if Redis unavailable; the queue falls back to inline processing in RecordsService.
    }
  }
}
