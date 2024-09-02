"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailEmbeddings = exports.user = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.user = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name'),
    picture: (0, pg_core_1.text)('picture'),
    email: (0, pg_core_1.text)('email').notNull(),
    grantId: (0, pg_core_1.text)('grantId').notNull(),
    createdAt: (0, pg_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updatedAt').defaultNow().notNull(),
    lastLogin: (0, pg_core_1.timestamp)('lastLogin').defaultNow().notNull(),
    dataLastRefreshed: (0, pg_core_1.timestamp)('dataLastRefreshed').defaultNow().notNull(),
    embeddingGenerationStatus: (0, pg_core_1.text)('embeddingGenerationStatus').default('not_started').notNull(),
}, (users) => {
    return {
        uniqueIdx: (0, pg_core_1.uniqueIndex)('unique_idx').on(users.email),
        grantIdIdx: (0, pg_core_1.index)('grantId_idx').on(users.grantId),
        emailIdx: (0, pg_core_1.index)('email_idx').on(users.email),
    };
});
exports.emailEmbeddings = (0, pg_core_1.pgTable)('email_embeddings', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.user.id, {
        onDelete: 'cascade',
    }),
    emailId: (0, pg_core_1.text)('email_id').notNull(),
    subject: (0, pg_core_1.text)('subject').notNull(),
    snippet: (0, pg_core_1.text)('snippet').notNull(),
    date: (0, pg_core_1.timestamp)('date').notNull(),
    from: (0, pg_core_1.text)('from').notNull(),
    to: (0, pg_core_1.text)('to').notNull(),
    embedding: (0, pg_core_1.vector)('embedding', { dimensions: 768 }).notNull(),
}, table => ({
    embeddingIndex: (0, pg_core_1.index)('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
}));
