import { Injectable } from '@nestjs/common';

@Injectable()
export class VectorStoreService {
  private store: { id: string; patientId: string; vector: number[]; payload: any }[] = [];

  async upsert(id: string, patientId: string, vector: number[], payload: any) {
    this.store.push({ id, patientId, vector, payload });
    return { success: true };
  }

  async query(patientId: string, vector: number[], topK = 5) {
    // Very naive cosine-similarity stub limited to same patientId
    const candidates = this.store.filter((s) => s.patientId === patientId);
    const scored = candidates.map((c) => ({
      ...c,
      score: this.cosine(vector, c.vector),
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  private cosine(a: number[], b: number[]) {
    const dot = a.reduce((s, ai, i) => s + ai * (b[i] ?? 0), 0);
    const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
    const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
    if (magA === 0 || magB === 0) return 0;
    return dot / (magA * magB);
  }
}
