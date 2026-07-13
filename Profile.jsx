import React, { useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    area: user?.area || "",
    bio: user?.bio || "",
    businessName: user?.businessName || "",
    accountType: user?.accountType || "both",
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    setLoading(true);
    try {
      const res = await api.put("/users/me", form);
      updateUser(res.data.user);
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-5 py-12">
      <h1 className="text-2xl font-display font-bold mb-1">Edit profile</h1>
      <p className="text-slate-650 mb-8">Keep your details current so people know who they're dealing with.</p>

      {error && <div className="mb-4 rounded-lg bg-coral/10 text-coral px-4 py-3 text-sm">{error}</div>}
      {saved && <div className="mb-4 rounded-lg bg-marigold-100 text-ink-700 px-4 py-3 text-sm">Profile updated.</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-text">Full name</label>
          <input required className="input-field" value={form.fullName} onChange={handleChange("fullName")} />
        </div>
        <div>
          <label className="label-text">Phone</label>
          <input required className="input-field" value={form.phone} onChange={handleChange("phone")} />
        </div>
        <div>
          <label className="label-text">Area</label>
          <input required className="input-field" value={form.area} onChange={handleChange("area")} />
        </div>
        <div>
          <label className="label-text">Business name (optional)</label>
          <input className="input-field" value={form.businessName} onChange={handleChange("businessName")} />
        </div>
        <div>
          <label className="label-text">Bio</label>
          <textarea rows={4} className="input-field" value={form.bio} onChange={handleChange("bio")} />
        </div>
        <div>
          <label className="label-text">I want to</label>
          <select className="input-field" value={form.accountType} onChange={handleChange("accountType")}>
            <option value="both">Both offer and request services</option>
            <option value="seeker">Only look for services</option>
            <option value="provider">Only offer services</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="btn-accent w-full">
          {loading ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
