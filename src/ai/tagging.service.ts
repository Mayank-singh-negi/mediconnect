import { Injectable } from '@nestjs/common';

@Injectable()
export class TaggingService {
  async classifyCondition(text: string) {
    const lower = text.toLowerCase();

    if (lower.includes('hypertension') || lower.includes('high blood pressure')) {
      return { conditionTag: 'hypertension', visitDate: this.extractVisitDate(text) };
    }

    if (lower.includes('diabetes') || lower.includes('blood sugar')) {
      return { conditionTag: 'diabetes', visitDate: this.extractVisitDate(text) };
    }

    return { conditionTag: 'general', visitDate: this.extractVisitDate(text) };
  }

  async sanitizeForLLM(text: string) {
    const redactedNames = text.replace(/[A-Z][a-z]+\s[A-Z][a-z]+/g, '[REDACTED_NAME]');
    const redactedEmails = redactedNames.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[REDACTED_EMAIL]');
    const redactedPhones = redactedEmails.replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[REDACTED_PHONE]');
    return redactedPhones;
  }

  private extractVisitDate(text: string) {
    const visitDateMatch = text.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
    return visitDateMatch ? visitDateMatch[1] : null;
  }
}
