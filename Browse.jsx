import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import ServiceCard from "../components/ServiceCard.jsx";
import { CATEGORIES } from "../components/CategoryChip.jsx";

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const category = searchParams.get("category") || "";
  const area = searchParams.get("area") || "";

  useEffect(() => {
    setLoading(true);
    api
      .get("/services", { params: { category, area, search } })
      .then((res) => setServices(res.data.services))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, [category, area, search]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <h1 className="text-2xl font-display font-bold mb-6">Browse services</h1>

      <div className="flex flex-wrap gap-3 mb-8">
        <input
          className="input-field max-w-xs"
          placeholder="Search services…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input-field max-w-xs" value={category} onChange={(e) => updateParam("category", e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <input
          className="input-field max-w-xs"
          placeholder="Area (e.g. Ojo)"
          value={area}
          onChange={(e) => updateParam("area", e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-slate-650">Loading services…</p>
      ) : services.length === 0 ? (
        <p className="text-slate-650">Nothing here yet. Be the first to list a service in this area.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <ServiceCard key={s._id} service={s} />
          ))}
        </div>
      )}
    </div>
  );
}
