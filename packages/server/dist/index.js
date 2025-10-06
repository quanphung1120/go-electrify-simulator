"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const shared_1 = require("@go-electrify/shared");
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const httpServer = http_1.default.createServer();
const io = new socket_io_1.Server(httpServer, {
    cors: { origin: "*" },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
    },
    pingInterval: 10000,
    pingTimeout: 30000,
});
io.on("connection", (socket) => {
    console.log("client connected:", socket.id);
    socket.on(shared_1.EventType.MESSAGE, (msg) => {
        console.log("received message:", msg);
        io.emit(shared_1.EventType.MESSAGE, msg);
    });
    socket.on("disconnect", () => {
        console.log("client disconnected:", socket.id);
    });
    socket.emit(shared_1.EventType.MESSAGE, `welcome ${socket.id}`);
});
httpServer.listen(PORT, () => {
    console.log(`Socket.io server listening on http://localhost:${PORT}`);
});
