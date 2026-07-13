import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocket } from "../context/SocketContext.jsx";

export default function ChatWindow() {
  const { id } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get(`/messages/conversations/${id}`).then((res) => setMessages(res.data.messages));
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("conversation:join", id);

    const handleNew = (message) => {
      if (message.conversation === id || message.conversation?._id === id) {
        setMessages((prev) => [...prev, message]);
      }
    };
    socket.on("message:new", handleNew);

    return () => {
      socket.emit("conversation:leave", id);
      socket.off("message:new", handleNew);
    };
  }, [socket, id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (socket) {
      socket.emit("message:send", { conversationId: id, text });
    } else {
      // Fallback to REST if the socket isn't connected for some reason
      api.post(`/messages/conversations/${id}`, { text }).then((res) =>
        setMessages((prev) => [...prev, res.data.message])
      );
    }
    setText("");
  };

  return (
    <div className="max-w-3xl mx-auto px-5 py-10 flex flex-col h-[75vh]">
      <h1 className="text-xl font-display font-bold mb-4">Conversation</h1>

      <div className="flex-1 overflow-y-auto card p-5 space-y-3 mb-4">
        {messages.map((m) => {
          const mine = m.sender._id === user._id;
          return (
            <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                  mine ? "bg-ink text-parchment" : "bg-marigold-100 text-ink-700"
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-3">
        <input
          className="input-field flex-1"
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn-accent">Send</button>
      </form>
    </div>
  );
}
