import { index, pgTable, serial, text, timestamp, uniqueIndex, vector, integer } from 'drizzle-orm/pg-core';


export const user = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name'),
    picture: text('picture'),
    email: text('email').notNull(),
    grantId: text('grantId').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
    lastLogin: timestamp('lastLogin').defaultNow().notNull(),
    dataLastRefreshed: timestamp('dataLastRefreshed').defaultNow().notNull(),
    embeddingGenerationStatus: text('embeddingGenerationStatus').default('not_started').notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex('unique_idx').on(users.email),
      grantIdIdx: index('grantId_idx').on(users.grantId),
      emailIdx: index('email_idx').on(users.email),
    };
  },
);

export const emailEmbeddings = pgTable('email_embeddings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => user.id, {
    onDelete: 'cascade',
  }),
  emailId: text('email_id').notNull(),
  subject: text('subject').notNull(),
  snippet: text('snippet').notNull(),
  date: timestamp('date').notNull(),
  from: text('from').notNull(),
  to: text('to').notNull(),
  embedding: vector('embedding', { dimensions: 768 }).notNull(),
}, table => ({
  embeddingIndex: index('embeddingIndex').using(
    'hnsw',
    table.embedding.op('vector_cosine_ops'),
  ),
}),
);
