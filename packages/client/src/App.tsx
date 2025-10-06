import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { EventType } from "@go-electrify/shared";

const App: React.FC = () => {
  const [ip, setIp] = useState("localhost:3001");
  const [status, setStatus] = useState("disconnected");
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectToServer = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    socketRef.current = io(`http://${ip}`);

    socketRef.current.on("connect", () => {
      setStatus("connected");
      addMessage(`[system] connected (${socketRef.current?.id})`);
    });

    socketRef.current.on(EventType.MESSAGE, (msg: string) => {
      addMessage(msg);
    });

    socketRef.current.on("disconnect", () => {
      setStatus("disconnected");
      addMessage("[system] disconnected");
    });
  };

  const addMessage = (text: string) => {
    setMessages((prev) => [...prev, text]);
  };

  const handleConnect = () => {
    if (ip.trim()) {
      connectToServer();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socketRef.current || !inputValue.trim()) return;
    socketRef.current.emit(EventType.MESSAGE, inputValue.trim());
    setInputValue("");
  };

  return (
    <div className="font-sans max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        go-electrify-simulator — Socket.io Client
      </h1>
      <div className="mb-4">
        <label htmlFor="ip" className="block text-sm font-medium mb-1">
          Server IP:
        </label>
        <input
          id="ip"
          placeholder="localhost:3001"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 mr-2"
        />
        {status === "disconnected" ? (
          <button
            onClick={handleConnect}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Connect
          </button>
        ) : (
          <button
            onClick={() => socketRef.current?.disconnect()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Disconnect
          </button>
        )}
      </div>
      <div className="mb-4">
        Status:{" "}
        <span
          className={status === "connected" ? "text-green-600" : "text-red-600"}
        >
          {status}
        </span>
      </div>
      <div className="border border-gray-300 p-2 h-80 overflow-auto bg-gray-50 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="p-1 border-b text-black border-gray-200 text-sm"
          >
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          placeholder="Type a message..."
          autoComplete="off"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 flex-1 mr-2"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default App;
