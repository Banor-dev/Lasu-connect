import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    area: "",
    accountType: "both",
    isStudent: true,
    businessName: "",
  });

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <h1 className="text-2xl font-display font-bold mb-1">Join LASU Professional Connect</h1>
      <p className="text-slate-650 mb-8">Find help, or start getting found for the work you already do.</p>

      {error && <div className="mb-4 rounded-lg bg-coral/10 text-coral px-4 py-3 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-text">Full name</label>
          <input required className="input-field" value={form.fullName} onChange={handleChange("fullName")} />
        </div>
        <div>
          <label className="label-text">Email</label>
          <input type="email" required className="input-field" value={form.email} onChange={handleChange("email")} />
        </div>
        <div>
          <label className="label-text">Password</label>
          <input
            type="password"
            required
            minLength={6}
            className="input-field"
            value={form.password}
            onChange={handleChange("password")}
          />
        </div>
        <div>
          <label className="label-text">Phone number</label>
          <input required className="input-field" value={form.phone} onChange={handleChange("phone")} />
        </div>
        <div>
          <label className="label-text">Area (e.g. Ojo, Iyana-Iba, LASU Main Gate)</label>
          <input required className="input-field" value={form.area} onChange={handleChange("area")} />
        </div>
        <div>
          <label className="label-text">I want to</label>
          <select className="input-field" value={form.accountType} onChange={handleChange("accountType")}>
            <option value="both">Both offer and request services</option>
            <option value="seeker">Only look for services</option>
            <option value="provider">Only offer services</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            id="isStudent"
            type="checkbox"
            checked={form.isStudent}
            onChange={handleChange("isStudent")}
            className="rounded border-ink/30"
          />
          <label htmlFor="isStudent" className="text-sm text-slate-650">I'm a LASU student</label>
        </div>
        {!form.isStudent && (
          <div>
            <label className="label-text">Business name (optional)</label>
            <input className="input-field" value={form.businessName} onChange={handleChange("businessName")} />
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-accent w-full">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-650">
        Already have an account? <Link to="/login" className="text-marigold-600 font-medium">Log in</Link>
      </p>
    </div>
  );
}
