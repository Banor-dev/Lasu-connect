import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { CATEGORIES } from "../components/CategoryChip.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function PostService() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: CATEGORIES[0].value,
    priceType: "negotiable",
    price: "",
    area: user?.area || "",
  });

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { ...form, price: form.price ? Number(form.price) : undefined };
      const res = await api.post("/services", payload);
      navigate(`/services/${res.data.service._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-5 py-12">
      <h1 className="text-2xl font-display font-bold mb-1">List a service</h1>
      <p className="text-slate-650 mb-8">Tell people around you what you can help with.</p>

      {error && <div className="mb-4 rounded-lg bg-coral/10 text-coral px-4 py-3 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-text">Title</label>
          <input required className="input-field" placeholder="e.g. Logo design for small businesses" value={form.title} onChange={handleChange("title")} />
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-text">Pricing</label>
            <select className="input-field" value={form.priceType} onChange={handleChange("priceType")}>
              <option value="negotiable">Negotiable</option>
              <option value="fixed">Fixed price</option>
              <option value="hourly">Hourly rate</option>
            </select>
          </div>
          {form.priceType !== "negotiable" && (
            <div>
              <label className="label-text">Amount (₦)</label>
              <input type="number" min="0" className="input-field" value={form.price} onChange={handleChange("price")} />
            </div>
          )}
        </div>
        <div>
          <label className="label-text">Area</label>
          <input required className="input-field" value={form.area} onChange={handleChange("area")} />
        </div>

        <button type="submit" disabled={loading} className="btn-accent w-full">
          {loading ? "Publishing…" : "Publish listing"}
        </button>
      </form>
    </div>
  );
}
