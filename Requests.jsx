import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import RequestCard from "../components/RequestCard.jsx";
import { CATEGORIES } from "../components/CategoryChip.jsx";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/requests", { params: { category } })
      .then((res) => setRequests(res.data.requests))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-display font-bold">Open requests</h1>
        <Link to="/requests/new" className="btn-accent">Post a request</Link>
      </div>

      <select className="input-field max-w-xs mb-8" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      {loading ? (
        <p className="text-slate-650">Loading requests…</p>
      ) : requests.length === 0 ? (
        <p className="text-slate-650">No open requests right now. Check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((r) => (
            <RequestCard key={r._id} request={r} />
          ))}
        </div>
      )}
    </div>
  );
}
