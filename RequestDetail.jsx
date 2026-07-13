import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import CategoryChip from "../components/CategoryChip.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function RequestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    api.get(`/requests/${id}`).then((res) => setRequest(res.data.request));
  }, [id]);

  const handleMessage = async () => {
    if (!user) return navigate("/login");
    setStarting(true);
    try {
      const res = await api.post("/messages/conversations", {
        recipientId: request.postedBy._id,
        requestId: request._id,
      });
      navigate(`/chat/${res.data.conversation._id}`);
    } finally {
      setStarting(false);
    }
  };

  if (!request) return <div className="max-w-4xl mx-auto px-5 py-16 text-slate-650">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <CategoryChip value={request.category} />
      <h1 className="text-3xl font-display font-bold mt-3 mb-2">{request.title}</h1>
      <p className="text-slate-650 mb-6">{request.area} · Posted by {request.postedBy?.fullName}</p>

      <div className="card p-6 mb-6">
        <p className="whitespace-pre-line text-ink-700">{request.description}</p>
      </div>

      <div className="card p-6 max-w-xs">
        <p className="label-text">Budget</p>
        <p className="font-display font-semibold text-xl">
          {request.budget ? `₦${request.budget.toLocaleString()}` : "Open to offers"}
        </p>
      </div>

      <button onClick={handleMessage} disabled={starting} className="btn-accent mt-8">
        {starting ? "Starting chat…" : "Offer to help"}
      </button>
    </div>
  );
}
