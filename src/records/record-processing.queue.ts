import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export interface RecordProcessingJobData {
  id: string;
  patientId: string;
  fileUrl: string;
  extractedText?: string;
}

@Injectable()
export class RecordProcessingQueue implements OnModuleInit {
  private queue?: Queue<RecordProcessingJobData>;

  async onModuleInit() {
    if (process.env.USE_REDIS !== 'true') {
      this.queue = undefined;
      return;
    }

    const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
    const connection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
    });

    try {
      await connection.connect();
      this.queue = new Queue<RecordProcessingJobData>('record-processing', { connection });
    } catch {
      this.queue = undefined;
    }
  }

  async enqueue(data: RecordProcessingJobData): Promise<boolean> {
    if (!this.queue) {
      return false;
    }

    try {
      await this.queue.add('process-record', data, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      });
      return true;
    } catch {
      return false;
    }
  }
}
