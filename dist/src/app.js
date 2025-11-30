"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = __importDefault(require("./Server"));
const server = new Server_1.default();
server.startServer();
server.startMongoDB();
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.stop();
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.stop();
    process.exit(0);
});
