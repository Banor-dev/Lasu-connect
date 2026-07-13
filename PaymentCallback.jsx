import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios.js";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (!reference) {
      setStatus("missing");
      return;
    }
    api
      .get(`/payments/verify/${reference}`)
      .then((res) => setStatus(res.data.transaction.status))
      .catch(() => setStatus("failed"));
  }, [reference]);

  const content = {
    checking: { title: "Confirming your payment…", tone: "text-slate-650" },
    success: { title: "Payment successful", tone: "text-ink" },
    failed: { title: "Payment could not be confirmed", tone: "text-coral" },
    missing: { title: "No payment reference found", tone: "text-coral" },
  }[status];

  return (
    <div className="max-w-md mx-auto px-5 py-24 text-center">
      <h1 className={`text-2xl font-display font-bold ${content.tone}`}>{content.title}</h1>
      <p className="text-slate-650 mt-3 mb-8">
        {status === "success"
          ? "Your payment has gone through. The other party has been notified."
          : "If money left your account, hold on — check your transactions or contact support before retrying."}
      </p>
      <Link to="/dashboard" className="btn-accent">Back to dashboard</Link>
    </div>
  );
}
