import { io } from "socket.io-client";

const statusEl = document.getElementById("status") as HTMLElement;
const messagesEl = document.getElementById("messages") as HTMLElement;
const form = document.getElementById("form") as HTMLFormElement;
const input = document.getElementById("input") as HTMLInputElement;
const ipInput = document.getElementById("ip") as HTMLInputElement;
const connectBtn = document.getElementById("connect") as HTMLButtonElement;

let socket: any = null;

function addMessage(text: string) {
  const d = document.createElement("div");
  d.className = "message";
  d.textContent = text;
  messagesEl.appendChild(d);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function connectToServer(ip: string) {
  if (socket) {
    socket.disconnect();
  }
  socket = io(`http://${ip}`);
  socket.on("connect", () => {
    statusEl.textContent = "connected";
    addMessage(`[system] connected (${socket.id})`);
  });

  socket.on("message", (msg: string) => {
    addMessage(msg);
  });

  socket.on("disconnect", () => {
    statusEl.textContent = "disconnected";
    addMessage("[system] disconnected");
  });
}

connectBtn.addEventListener("click", () => {
  const ip = ipInput.value.trim();
  if (ip) {
    connectToServer(ip);
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!socket) return;
  const v = input.value.trim();
  if (!v) return;
  socket.emit("message", v);
  input.value = "";
});
