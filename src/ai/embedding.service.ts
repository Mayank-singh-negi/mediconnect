import { Injectable } from '@nestjs/common';

@Injectable()
export class EmbeddingService {
  async embedText(text: string) {
    // Stub: return a deterministic pseudo-vector for local testing
    const hash = Array.from(text).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const vector = new Array(1536).fill(0).map((_, i) => ((hash + i) % 100) / 100);
    return vector;
  }
}
