import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { EventType } from "@go-electrify/shared";
const App = () => {
    const [ip, setIp] = useState("localhost:3001");
    const [status, setStatus] = useState("disconnected");
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
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
        socketRef.current.on(EventType.MESSAGE, (msg) => {
            addMessage(msg);
        });
        socketRef.current.on("disconnect", () => {
            setStatus("disconnected");
            addMessage("[system] disconnected");
        });
    };
    const addMessage = (text) => {
        setMessages((prev) => [...prev, text]);
    };
    const handleConnect = () => {
        if (ip.trim()) {
            connectToServer();
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!socketRef.current || !inputValue.trim())
            return;
        socketRef.current.emit(EventType.MESSAGE, inputValue.trim());
        setInputValue("");
    };
    return (_jsxs("div", { className: "font-sans max-w-3xl mx-auto p-4", children: [_jsx("h1", { className: "text-2xl font-bold mb-4", children: "go-electrify-simulator \u2014 Socket.io Client" }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "ip", className: "block text-sm font-medium mb-1", children: "Server IP:" }), _jsx("input", { id: "ip", placeholder: "localhost:3001", value: ip, onChange: (e) => setIp(e.target.value), className: "border border-gray-300 rounded px-3 py-2 mr-2" }), status === "disconnected" ? (_jsx("button", { onClick: handleConnect, className: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600", children: "Connect" })) : (_jsx("button", { onClick: () => socketRef.current?.disconnect(), className: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600", children: "Disconnect" }))] }), _jsxs("div", { className: "mb-4", children: ["Status:", " ", _jsx("span", { className: status === "connected" ? "text-green-600" : "text-red-600", children: status })] }), _jsxs("div", { className: "border border-gray-300 p-2 h-80 overflow-auto bg-gray-50 mb-4", children: [messages.map((msg, index) => (_jsx("div", { className: "p-1 border-b text-black border-gray-200 text-sm", children: msg }, index))), _jsx("div", { ref: messagesEndRef })] }), _jsxs("form", { onSubmit: handleSubmit, className: "flex", children: [_jsx("input", { placeholder: "Type a message...", autoComplete: "off", value: inputValue, onChange: (e) => setInputValue(e.target.value), className: "border border-gray-300 rounded px-3 py-2 flex-1 mr-2" }), _jsx("button", { type: "submit", className: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600", children: "Send" })] })] }));
};
export default App;
