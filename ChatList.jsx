import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ChatList() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    api.get("/messages/conversations").then((res) => setConversations(res.data.conversations));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h1 className="text-2xl font-display font-bold mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <p className="text-slate-650">No conversations yet. Message a provider or a requester to get started.</p>
      ) : (
        <div className="space-y-3">
          {conversations.map((c) => {
            const other = c.participants.find((p) => p._id !== user._id);
            return (
              <Link key={c._id} to={`/chat/${c._id}`} className="card p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="font-display font-semibold">{other?.fullName}</p>
                  <p className="text-sm text-slate-650 line-clamp-1">{c.lastMessage || "Start the conversation"}</p>
                </div>
                <span className="text-xs text-slate-650 font-mono">
                  {new Date(c.lastMessageAt).toLocaleDateString()}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
