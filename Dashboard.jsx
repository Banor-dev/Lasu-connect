import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import RequestCard from "../components/RequestCard.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    api.get("/services/mine/all").then((res) => setServices(res.data.services));
    api.get("/requests/mine/all").then((res) => setRequests(res.data.requests));
    api.get("/wallet/me").then((res) => setWallet(res.data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <h1 className="text-2xl font-display font-bold mb-1">Welcome back, {user?.fullName?.split(" ")[0]}</h1>
      <p className="text-slate-650 mb-8">{user?.area} · {user?.isStudent ? "LASU student" : user?.businessName || "Business account"}</p>

      {wallet && (
        <Link to="/wallet" className="card p-5 mb-8 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm text-slate-650">Wallet balance</p>
            <p className="font-display font-bold text-2xl">₦{wallet.walletBalance.toLocaleString()}</p>
          </div>
          <span className="btn-outline !px-4 !py-2 text-sm">Manage wallet →</span>
        </Link>
      )}

      <div className="flex flex-wrap gap-4 mb-10">
        <Link to="/services/new" className="btn-accent">List a service</Link>
        <Link to="/requests/new" className="btn-outline">Post a request</Link>
        <Link to="/profile" className="btn-outline">Edit profile</Link>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-display font-semibold mb-4">Your service listings</h2>
        {services.length === 0 ? (
          <p className="text-slate-650">You haven't listed any services yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => <ServiceCard key={s._id} service={{ ...s, provider: user }} />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-display font-semibold mb-4">Your requests</h2>
        {requests.length === 0 ? (
          <p className="text-slate-650">You haven't posted any requests yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((r) => <RequestCard key={r._id} request={{ ...r, postedBy: user }} />)}
          </div>
        )}
      </section>
    </div>
  );
}
