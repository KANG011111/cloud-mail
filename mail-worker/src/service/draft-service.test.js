import { describe, expect, it } from 'vitest';
import draftService from './draft-service';

describe('draft service payloads', () => {
  it('normalizes a draft into a server-persistable record', () => {
    const result = draftService.toRecord({
      accountId: 1,
      sendEmail: 'kang@seo.pnsave.com',
      name: 'kang',
      receiveEmail: ['lead@example.com'],
      subject: 'Subject',
      text: 'Plain text',
      content: '<p>Plain text</p>',
      sendType: '',
      emailId: 0,
      attachments: [],
    }, 42);

    expect(result).toEqual({
      userId: 42,
      accountId: 1,
      sendEmail: 'kang@seo.pnsave.com',
      name: 'kang',
      receiveEmail: '["lead@example.com"]',
      subject: 'Subject',
      text: 'Plain text',
      content: '<p>Plain text</p>',
      sendType: '',
      emailId: 0,
      attachments: '[]',
    });
  });
});
