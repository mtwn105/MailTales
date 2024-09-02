"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const ai_1 = require("./ai"); // Assuming this function exists in your project
const schema = __importStar(require("./drizzle/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const vercel_postgres_1 = require("drizzle-orm/vercel-postgres");
const postgres_1 = require("@vercel/postgres");
const nylas_1 = __importDefault(require("nylas"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
exports.db = (0, vercel_postgres_1.drizzle)(postgres_1.sql, { schema });
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    brokers: [`${process.env.UPSTASH_KAFKA_BROKERS}`],
    ssl: true,
    sasl: {
        mechanism: 'scram-sha-256',
        username: `${process.env.UPSTASH_KAFKA_USERNAME}`,
        password: `${process.env.UPSTASH_KAFKA_PASSWORD}`
    },
    logLevel: kafkajs_1.logLevel.ERROR,
});
const consumer = kafka.consumer({ groupId: 'consumer_group_1' });
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    yield consumer.connect();
    yield consumer.subscribe({ topic: 'generate-email-embeddings', fromBeginning: true });
    yield consumer.run({
        eachMessage: (_a) => __awaiter(void 0, [_a], void 0, function* ({ topic, partition, message }) {
            var _b, _c;
            console.log({
                partition,
                offset: message.offset,
                value: (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString(),
            });
            const userId = Number((_c = message.value) === null || _c === void 0 ? void 0 : _c.toString());
            console.log("Generating email embeddings for user", userId);
            yield generateEmailEmbeddings(userId);
        }),
    });
});
run().catch(e => console.error('Error running consumer', e));
const getEmails = (grantId_1, ...args_1) => __awaiter(void 0, [grantId_1, ...args_1], void 0, function* (grantId, limit = 5, pageToken = null) {
    console.log("Getting emails for grantId", grantId);
    const nylas = new nylas_1.default({
        apiKey: process.env.NYLAS_API_KEY,
        apiUri: process.env.NYLAS_API_URI,
    });
    const queryParams = {
        in: ["INBOX"],
        limit: limit,
    };
    if (pageToken && pageToken.length > 0) {
        queryParams.pageToken = pageToken;
    }
    const messages = yield nylas.messages.list({
        identifier: grantId,
        queryParams,
    });
    return messages;
});
const generateEmailEmbeddings = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let [user] = yield exports.db.update(schema.user).set({ embeddingGenerationStatus: "in_progress" }).where((0, drizzle_orm_1.eq)(schema.user.id, userId)).returning();
        const grantId = user === null || user === void 0 ? void 0 : user.grantId;
        // Get first 30 emails by 15 in loop
        let emails = [];
        let pageToken = null;
        for (let i = 0; i < 2; i++) {
            const emailPage = yield getEmails(user === null || user === void 0 ? void 0 : user.grantId, 15, pageToken);
            emails.push(...emailPage.data);
            pageToken = emailPage.nextCursor;
        }
        emails = emails.filter(e => { var _a; return e.snippet && ((_a = e.snippet) === null || _a === void 0 ? void 0 : _a.length) > 0; }).map(e => {
            var _a, _b, _c, _d;
            return ({
                userId: user.id,
                emailId: e.id,
                subject: e.subject,
                snippet: e.snippet,
                date: e.date,
                from: (_b = (_a = e.from) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.email,
                to: (_d = (_c = e.to) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.email,
            });
        });
        const emailStrings = emails.map((e) => `Email
    Subject: ${e.subject}
    From: ${e.from}
    To: ${e.to}
    Snippet: ${e.snippet}
    Date: ${new Date(e.date * 1000).toLocaleDateString() + " " + new Date(e.date * 1000).toLocaleTimeString()}`);
        // console.log("Email Strings", emailStrings);
        let embedding = yield (0, ai_1.generateEmbeddings)(emailStrings);
        // console.log("Embedding", embedding);
        let emailsWithEmbeddings = emails.map((e, index) => ({
            userId: e.userId,
            emailId: e.emailId,
            subject: e.subject,
            snippet: e.snippet,
            date: new Date(e.date * 1000),
            from: e.from,
            to: e.to,
            embedding: embedding[index].map((e) => e),
        }));
        // delete all existing email embeddings for this user
        yield exports.db.delete(schema.emailEmbeddings).where((0, drizzle_orm_1.eq)(schema.emailEmbeddings.userId, user.id));
        yield exports.db.insert(schema.emailEmbeddings).values(emailsWithEmbeddings);
        yield exports.db.update(schema.user).set({ embeddingGenerationStatus: "completed", dataLastRefreshed: new Date(), updatedAt: new Date() }).where((0, drizzle_orm_1.eq)(schema.user.id, user.id));
        console.log("Embedding updated in db");
    }
    catch (error) {
        console.error("Error generating email embeddings:", error);
    }
});
