import http from "http";
import { Server } from "socket.io";
import { EventType } from "@go-electrify/shared";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

const httpServer = http.createServer();
const io = new Server(httpServer, {
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

  socket.on(EventType.MESSAGE, (msg: string) => {
    console.log("received message:", msg);
    io.emit(EventType.MESSAGE, msg);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected:", socket.id);
  });

  socket.emit(EventType.MESSAGE, `welcome ${socket.id}`);
});

httpServer.listen(PORT, () => {
  console.log(`Socket.io server listening on http://localhost:${PORT}`);
});
