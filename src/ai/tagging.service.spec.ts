jest.mock('@nestjs/common', () => ({
  Injectable: () => (target: any) => target,
}));

import { TaggingService } from './tagging.service';

describe('TaggingService', () => {
  it('detects hypertension from clinical notes', async () => {
    const service = new TaggingService();
    const result = await service.classifyCondition('Patient has hypertension and elevated blood pressure.');

    expect(result.conditionTag).toBe('hypertension');
  });

  it('redacts names and contact details before llm processing', async () => {
    const service = new TaggingService();
    const result = await service.sanitizeForLLM('John Doe had diabetes and can be reached at 555-123-4567 or john.doe@example.com.');

    expect(result).not.toContain('John Doe');
    expect(result).not.toContain('555-123-4567');
    expect(result).not.toContain('john.doe@example.com');
    expect(result).toContain('[REDACTED_NAME]');
  });
});
