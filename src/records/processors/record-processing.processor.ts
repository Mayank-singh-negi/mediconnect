import { Injectable } from '@nestjs/common';
import { TaggingService } from '../../ai/tagging.service';
import { EmbeddingService } from '../../ai/embedding.service';
import { VectorStoreService } from '../../ai/vector-store.service';

@Injectable()
export class RecordProcessingProcessor {
  constructor(
    private readonly tagging: TaggingService,
    private readonly embedding: EmbeddingService,
    private readonly vectorStore: VectorStoreService,
  ) {}

  async process(record: { id: string; patientId: string; fileUrl: string; extractedText?: string }) {
    // OCR would run here; using extractedText if present
    const text = record.extractedText ?? `Content from ${record.fileUrl}`;
    const sanitized = await this.tagging.sanitizeForLLM(text);
    const meta = await this.tagging.classifyCondition(sanitized);

    const vector = await this.embedding.embedText(sanitized);
    await this.vectorStore.upsert(record.id, record.patientId, vector, { recordId: record.id, condition: meta.conditionTag });

    return { recordId: record.id, conditionTag: meta.conditionTag };
  }
}
