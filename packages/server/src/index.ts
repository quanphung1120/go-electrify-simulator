import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("client connected:", socket.id);

  socket.on("message", (msg: string) => {
    console.log("received message:", msg);
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected:", socket.id);
  });

  socket.emit("message", `welcome ${socket.id}`);
});

httpServer.listen(PORT, () => {
  console.log(`Socket.io server listening on http://localhost:${PORT}`);
});
