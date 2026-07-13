import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const STATUS_STYLES = {
  pending: "bg-stone-100 text-stone-600",
  held: "bg-marigold-100 text-ink-700",
  released: "bg-emerald-100 text-emerald-700",
  disputed: "bg-coral/15 text-coral",
  failed: "bg-coral/15 text-coral",
  refunded: "bg-stone-100 text-stone-600",
};

export default function MyPayments() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disputingId, setDisputingId] = useState(null);
  const [disputeReason, setDisputeReason] = useState("");

  const load = () => {
    setLoading(true);
    api
      .get("/payments/mine")
      .then((res) => setTransactions(res.data.transactions))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const confirm = async (id) => {
    await api.post(`/payments/${id}/confirm`);
    load();
  };

  const submitDispute = async (id) => {
    await api.post(`/payments/${id}/dispute`, { reason: disputeReason });
    setDisputingId(null);
    setDisputeReason("");
    load();
  };

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h1 className="text-2xl font-display font-bold mb-1">Your payments</h1>
      <p className="text-slate-650 mb-8">
        Funds are held until both sides confirm the job is done — that protects both of you.
      </p>

      {loading ? (
        <p className="text-slate-650">Loading…</p>
      ) : transactions.length === 0 ? (
        <p className="text-slate-650">No transactions yet.</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((t) => {
            const isPayer = t.payer._id === user._id;
            const myConfirmField = isPayer ? t.confirmedByPayer : t.confirmedByPayee;
            const otherParty = isPayer ? t.payee.fullName : t.payer.fullName;

            return (
              <div key={t._id} className="card p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-display font-semibold">
                      {isPayer ? `You paid ${otherParty}` : `${otherParty} paid you`}
                    </p>
                    <p className="text-sm text-slate-650 font-mono">
                      ₦{t.amount.toLocaleString()} · ref {t.paystackReference}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[t.status]}`}>
                    {t.status}
                  </span>
                </div>

                {t.status === "held" && (
                  <div className="mt-4 pt-4 border-t border-ink/10">
                    {myConfirmField ? (
                      <p className="text-sm text-slate-650">
                        You've confirmed. Waiting on {otherParty} to confirm before funds release.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        <button onClick={() => confirm(t._id)} className="btn-accent !px-4 !py-2 text-sm">
                          {isPayer ? "Confirm job done" : "Confirm delivered"}
                        </button>
                        <button
                          onClick={() => setDisputingId(disputingId === t._id ? null : t._id)}
                          className="btn-outline !px-4 !py-2 text-sm !border-coral !text-coral hover:!bg-coral hover:!text-white"
                        >
                          Report a problem
                        </button>
                      </div>
                    )}

                    {disputingId === t._id && (
                      <div className="mt-3 flex flex-col gap-2">
                        <textarea
                          className="input-field"
                          rows={3}
                          placeholder="What went wrong?"
                          value={disputeReason}
                          onChange={(e) => setDisputeReason(e.target.value)}
                        />
                        <button
                          onClick={() => submitDispute(t._id)}
                          className="btn-outline !px-4 !py-2 text-sm !border-coral !text-coral self-start"
                        >
                          Submit dispute
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {t.status === "disputed" && (
                  <p className="text-sm text-coral mt-3 pt-3 border-t border-ink/10">
                    Under review: {t.disputeReason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
