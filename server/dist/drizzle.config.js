"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@/drizzle/envConfig");
const drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: './drizzle/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.POSTGRES_URL,
    },
});
