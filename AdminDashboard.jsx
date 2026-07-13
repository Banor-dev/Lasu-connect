import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

const STATUS_OPTIONS = ["", "pending", "held", "released", "disputed", "failed", "refunded"];

export default function AdminDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ totalVolume: 0, totalCommission: 0 });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/payments/admin/all", { params: { status: status || undefined } })
      .then((res) => {
        setTransactions(res.data.transactions);
        setTotals(res.data.totals);
      })
      .catch((err) => setError(err.response?.data?.message || "You may not have admin access"))
      .finally(() => setLoading(false));
  }, [status]);

  const disputedCount = transactions.filter((t) => t.status === "disputed").length;

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <h1 className="text-2xl font-display font-bold mb-1">Admin · Transactions</h1>
      <p className="text-slate-650 mb-8">Everything moving through the platform, in one place.</p>

      {error && <div className="mb-6 rounded-lg bg-coral/10 text-coral px-4 py-3 text-sm">{error}</div>}

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5">
          <p className="text-sm text-slate-650 mb-1">Total volume</p>
          <p className="font-display font-bold text-2xl">₦{totals.totalVolume.toLocaleString()}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-650 mb-1">Commission earned</p>
          <p className="font-display font-bold text-2xl text-marigold-600">
            ₦{totals.totalCommission.toLocaleString()}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-650 mb-1">Disputes needing review</p>
          <p className="font-display font-bold text-2xl text-coral">{disputedCount}</p>
        </div>
      </div>

      <select className="input-field max-w-xs mb-6" value={status} onChange={(e) => setStatus(e.target.value)}>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>{s ? s[0].toUpperCase() + s.slice(1) : "All statuses"}</option>
        ))}
      </select>

      {loading ? (
        <p className="text-slate-650">Loading…</p>
      ) : (
        <div className="overflow-x-auto card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-ink/10 text-slate-650">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Payer</th>
                <th className="px-4 py-3">Payee</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Commission</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="border-b border-ink/5">
                  <td className="px-4 py-3 font-mono text-xs">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{t.payer?.fullName}</td>
                  <td className="px-4 py-3">{t.payee?.fullName}</td>
                  <td className="px-4 py-3 font-mono">₦{t.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono">₦{t.commissionAmount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={t.status === "disputed" ? "text-coral font-medium" : ""}>{t.status}</span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-650">No transactions match this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
