import React from "react";
import { Link } from "react-router-dom";
import CategoryChip from "./CategoryChip.jsx";

export default function ServiceCard({ service }) {
  const priceLabel =
    service.priceType === "negotiable"
      ? "Negotiable"
      : service.priceType === "hourly"
      ? `₦${service.price?.toLocaleString()}/hr`
      : `₦${service.price?.toLocaleString()}`;

  return (
    <Link to={`/services/${service._id}`} className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <CategoryChip value={service.category} />
        <span className="font-mono text-sm text-ink-700">{priceLabel}</span>
      </div>

      <h3 className="font-display font-semibold text-lg leading-snug">{service.title}</h3>
      <p className="text-sm text-slate-650 line-clamp-2">{service.description}</p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-ink/10 text-sm">
        <span className="text-ink-700 font-medium">{service.provider?.fullName}</span>
        <span className="text-slate-650">{service.area}</span>
      </div>
    </Link>
  );
}
