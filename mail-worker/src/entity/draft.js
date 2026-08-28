import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const draft = sqliteTable('draft', {
  draftId: integer('draft_id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull(),
  accountId: integer('account_id').notNull().default(0),
  sendEmail: text('send_email').notNull().default(''),
  name: text('name').notNull().default(''),
  receiveEmail: text('receive_email').notNull().default('[]'),
  subject: text('subject').notNull().default(''),
  text: text('text').notNull().default(''),
  content: text('content').notNull().default(''),
  sendType: text('send_type').notNull().default(''),
  emailId: integer('email_id').notNull().default(0),
  attachments: text('attachments').notNull().default('[]'),
  createTime: text('create_time').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updateTime: text('update_time').default(sql`CURRENT_TIMESTAMP`).notNull(),
  isDel: integer('is_del').default(0).notNull(),
});

export default draft;
