import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { CATEGORIES } from "../components/CategoryChip.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function PostRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: CATEGORIES[0].value,
    budget: "",
    area: user?.area || "",
  });

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    setError("");
    setLoading(true);
    try {
      const payload = { ...form, budget: form.budget ? Number(form.budget) : undefined };
      const res = await api.post("/requests", payload);
      navigate(`/requests/${res.data.request._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not post request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-5 py-12">
      <h1 className="text-2xl font-display font-bold mb-1">Post what you need</h1>
      <p className="text-slate-650 mb-8">Describe the job and let people around you respond.</p>

      {error && <div className="mb-4 rounded-lg bg-coral/10 text-coral px-4 py-3 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-text">Title</label>
          <input required className="input-field" placeholder="e.g. Need a caterer for a birthday party" value={form.title} onChange={handleChange("title")} />
        </div>
        <div>
          <label className="label-text">Description</label>
          <textarea required rows={5} className="input-field" value={form.description} onChange={handleChange("description")} />
        </div>
        <div>
          <label className="label-text">Category</label>
          <select className="input-field" value={form.category} onChange={handleChange("category")}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-text">Budget (₦, optional)</label>
          <input type="number" min="0" className="input-field" value={form.budget} onChange={handleChange("budget")} />
        </div>
        <div>
          <label className="label-text">Area</label>
          <input required className="input-field" value={form.area} onChange={handleChange("area")} />
        </div>

        <button type="submit" disabled={loading} className="btn-accent w-full">
          {loading ? "Posting…" : "Post request"}
        </button>
      </form>
    </div>
  );
}
