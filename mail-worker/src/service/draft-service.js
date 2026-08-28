import orm from '../entity/orm';
import draft from '../entity/draft';
import { and, count, desc, eq, inArray, lt } from 'drizzle-orm';
import { isDel } from '../const/entity-const';
import BizError from '../error/biz-error';

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string' || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function asJsonArray(value) {
  return JSON.stringify(asArray(value));
}

function asNumber(value, fallback = 0) {
  const result = Number(value);
  return Number.isFinite(result) ? result : fallback;
}

const draftService = {
  toRecord(input = {}, userId) {
    return {
      userId,
      accountId: asNumber(input.accountId, 0),
      sendEmail: String(input.sendEmail || ''),
      name: String(input.name || ''),
      receiveEmail: asJsonArray(input.receiveEmail),
      subject: String(input.subject || ''),
      text: String(input.text || ''),
      content: String(input.content || ''),
      sendType: String(input.sendType || ''),
      emailId: asNumber(input.emailId, 0),
      attachments: asJsonArray(input.attachments),
    };
  },

  fromRecord(row) {
    return {
      ...row,
      receiveEmail: asArray(row.receiveEmail),
      attachments: asArray(row.attachments),
    };
  },

  async list(c, params = {}, userId) {
    let size = asNumber(params.size, 50);
    const cursor = asNumber(params.draftId, 0);
    if (size < 1) size = 50;
    if (size > 50) size = 50;

    const filters = [eq(draft.userId, userId), eq(draft.isDel, isDel.NORMAL)];
    if (cursor) filters.push(lt(draft.draftId, cursor));

    const [rows, totalRow] = await Promise.all([
      orm(c).select().from(draft).where(and(...filters)).orderBy(desc(draft.draftId)).limit(size).all(),
      orm(c).select({ total: count() }).from(draft)
        .where(and(eq(draft.userId, userId), eq(draft.isDel, isDel.NORMAL))).get(),
    ]);

    return {
      list: rows.map(row => this.fromRecord(row)),
      total: totalRow.total,
    };
  },

  async save(c, input = {}, userId) {
    const record = this.toRecord(input, userId);
    const draftId = asNumber(input.draftId, 0);

    if (!draftId) {
      return this.fromRecord(await orm(c).insert(draft).values(record).returning().get());
    }

    const existing = await orm(c).select({ draftId: draft.draftId })
      .from(draft)
      .where(and(eq(draft.draftId, draftId), eq(draft.userId, userId), eq(draft.isDel, isDel.NORMAL)))
      .get();
    if (!existing) throw new BizError('Draft not found', 404);

    const updated = await orm(c).update(draft)
      .set({ ...record, updateTime: new Date().toISOString() })
      .where(and(eq(draft.draftId, draftId), eq(draft.userId, userId), eq(draft.isDel, isDel.NORMAL)))
      .returning()
      .get();
    return this.fromRecord(updated);
  },

  async delete(c, params = {}, userId) {
    const ids = String(params.draftIds || '').split(',')
      .map(value => asNumber(value, 0)).filter(Boolean);
    if (!ids.length) return;

    await orm(c).update(draft).set({ isDel: isDel.DELETE, updateTime: new Date().toISOString() })
      .where(and(eq(draft.userId, userId), inArray(draft.draftId, ids))).run();
  },
};

export { asArray, asJsonArray };
export default draftService;
