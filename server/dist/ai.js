"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbeddings = generateEmbeddings;
const google_1 = require("@ai-sdk/google");
const ai_1 = require("ai");
function generateEmbeddings(emailStrings) {
    return __awaiter(this, void 0, void 0, function* () {
        const { embeddings } = yield (0, ai_1.embedMany)({
            model: google_1.google.embedding('text-embedding-004'),
            values: emailStrings,
        });
        return embeddings;
    });
}
