import React from "react";
import { Link } from "react-router-dom";
import CategoryChip from "./CategoryChip.jsx";

export default function RequestCard({ request }) {
  return (
    <Link to={`/requests/${request._id}`} className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <CategoryChip value={request.category} />
        {request.budget ? (
          <span className="font-mono text-sm text-ink-700">Budget: ₦{request.budget.toLocaleString()}</span>
        ) : (
          <span className="font-mono text-sm text-slate-650">Budget open</span>
        )}
      </div>

      <h3 className="font-display font-semibold text-lg leading-snug">{request.title}</h3>
      <p className="text-sm text-slate-650 line-clamp-2">{request.description}</p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-ink/10 text-sm">
        <span className="text-ink-700 font-medium">{request.postedBy?.fullName}</span>
        <span className="text-slate-650">{request.area}</span>
      </div>
    </Link>
  );
}
