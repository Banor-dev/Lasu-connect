import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [banks, setBanks] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [bankForm, setBankForm] = useState({ bankCode: "", accountNumber: "" });
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  const loadWallet = () => api.get("/wallet/me").then((res) => setWallet(res.data));
  const loadWithdrawals = () => api.get("/wallet/withdrawals").then((res) => setWithdrawals(res.data.withdrawals));
  const loadRewards = () => api.get("/wallet/rewards").then((res) => setRewards(res.data.rewards));

  useEffect(() => {
    loadWallet();
    loadWithdrawals();
    loadRewards();
    api.get("/wallet/banks").then((res) => setBanks(res.data.banks)).catch(() => setBanks([]));
  }, []);

  const saveBankDetails = async (e) => {
    e.preventDefault();
    setMessage(null);
    setBusy(true);
    try {
      const res = await api.post("/wallet/bank-details", bankForm);
      setMessage({ type: "ok", text: `Verified: ${res.data.bankAccountName}` });
      loadWallet();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Could not verify account" });
    } finally {
      setBusy(false);
    }
  };

  const withdraw = async (e) => {
    e.preventDefault();
    setMessage(null);
    setBusy(true);
    try {
      await api.post("/wallet/withdraw", { amount: Number(withdrawAmount) });
      setMessage({ type: "ok", text: "Withdrawal sent to your bank account." });
      setWithdrawAmount("");
      loadWallet();
      loadWithdrawals();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Withdrawal failed" });
    } finally {
      setBusy(false);
    }
  };

  if (!wallet) return <div className="max-w-3xl mx-auto px-5 py-16 text-slate-650">Loading…</div>;

  const milestoneProgressPercent = wallet.nextMilestone
    ? Math.min(100, ((wallet.nextMilestone.threshold - wallet.nextMilestone.remaining) / wallet.nextMilestone.threshold) * 100)
    : 100;

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h1 className="text-2xl font-display font-bold mb-8">Your wallet</h1>

      {message && (
        <div className={`mb-6 rounded-lg px-4 py-3 text-sm ${message.type === "ok" ? "bg-marigold-100 text-ink-700" : "bg-coral/10 text-coral"}`}>
          {message.text}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="card p-6">
          <p className="text-sm text-slate-650 mb-1">Available balance</p>
          <p className="font-display font-bold text-3xl">₦{wallet.walletBalance.toLocaleString()}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-slate-650 mb-1">Lifetime earnings</p>
          <p className="font-display font-bold text-3xl">₦{wallet.lifetimeEarnings.toLocaleString()}</p>
        </div>
      </div>

      {wallet.nextMilestone && (
        <div className="card p-6 mb-8">
          <p className="text-sm text-slate-650 mb-2">
            ₦{wallet.nextMilestone.remaining.toLocaleString()} to go until your next bonus:{" "}
            <span className="font-semibold text-ink">₦{wallet.nextMilestone.bonus.toLocaleString()} cash</span>{" "}
            at ₦{wallet.nextMilestone.threshold.toLocaleString()} lifetime earnings
          </p>
          <div className="w-full bg-marigold-100 rounded-full h-2.5">
            <div className="bg-marigold h-2.5 rounded-full transition-all" style={{ width: `${milestoneProgressPercent}%` }} />
          </div>
        </div>
      )}

      {!wallet.hasBankDetails ? (
        <div className="card p-6 mb-8">
          <h2 className="font-display font-semibold text-lg mb-4">Add your bank account</h2>
          <form onSubmit={saveBankDetails} className="space-y-4">
            <div>
              <label className="label-text">Bank</label>
              <select
                required
                className="input-field"
                value={bankForm.bankCode}
                onChange={(e) => setBankForm({ ...bankForm, bankCode: e.target.value })}
              >
                <option value="">Select your bank</option>
                {banks.map((b) => (
                  <option key={b.code} value={b.code}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-text">Account number</label>
              <input
                required
                className="input-field"
                value={bankForm.accountNumber}
                onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
              />
            </div>
            <button type="submit" disabled={busy} className="btn-accent w-full">
              {busy ? "Verifying…" : "Verify & save"}
            </button>
          </form>
        </div>
      ) : (
        <div className="card p-6 mb-8">
          <h2 className="font-display font-semibold text-lg mb-4">Withdraw to your bank</h2>
          <form onSubmit={withdraw} className="flex gap-3">
            <input
              type="number"
              required
              min={500}
              placeholder="Amount (₦)"
              className="input-field flex-1"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <button type="submit" disabled={busy} className="btn-accent whitespace-nowrap">
              {busy ? "Sending…" : "Withdraw"}
            </button>
          </form>
        </div>
      )}

      <section className="mb-8">
        <h2 className="font-display font-semibold text-lg mb-3">Withdrawal history</h2>
        {withdrawals.length === 0 ? (
          <p className="text-slate-650 text-sm">No withdrawals yet.</p>
        ) : (
          <div className="space-y-2">
            {withdrawals.map((w) => (
              <div key={w._id} className="card p-4 flex items-center justify-between text-sm">
                <span className="font-mono">₦{w.amount.toLocaleString()}</span>
                <span className="text-slate-650">{new Date(w.createdAt).toLocaleDateString()}</span>
                <span className={w.status === "failed" ? "text-coral" : "text-ink-700"}>{w.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display font-semibold text-lg mb-3">Milestone bonuses earned</h2>
        {rewards.length === 0 ? (
          <p className="text-slate-650 text-sm">No bonuses yet — keep completing jobs to unlock your first one.</p>
        ) : (
          <div className="space-y-2">
            {rewards.map((r) => (
              <div key={r._id} className="card p-4 flex items-center justify-between text-sm">
                <span>Hit ₦{r.milestoneThreshold.toLocaleString()} lifetime earnings</span>
                <span className="font-mono text-marigold-600">+₦{r.bonusAmount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
