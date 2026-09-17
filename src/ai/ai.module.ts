import { Module } from '@nestjs/common';
import { TaggingService } from './tagging.service';
import { EmbeddingService } from './embedding.service';
import { VectorStoreService } from './vector-store.service';

@Module({
  providers: [TaggingService, EmbeddingService, VectorStoreService],
  exports: [TaggingService, EmbeddingService, VectorStoreService],
})
export class AiModule {}
