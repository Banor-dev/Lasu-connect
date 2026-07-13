import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-parchment/95 backdrop-blur border-b border-ink/10">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-marigold flex items-center justify-center font-display font-bold text-ink">
            L
          </span>
          <span className="font-display font-bold text-lg tracking-tight">
            LASU Professional Connect
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 font-body text-sm text-ink-700">
          <Link to="/browse" className="hover:text-marigold-600">Browse services</Link>
          <Link to="/requests" className="hover:text-marigold-600">Open requests</Link>
          {user && <Link to="/chat" className="hover:text-marigold-600">Messages</Link>}
          {user && <Link to="/payments" className="hover:text-marigold-600">Payments</Link>}
          {user && <Link to="/wallet" className="hover:text-marigold-600">Wallet</Link>}
          {user?.accountType === "admin" && (
            <Link to="/admin" className="hover:text-marigold-600">Admin</Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="hidden sm:inline text-sm font-medium hover:text-marigold-600">
                {user.fullName?.split(" ")[0]}
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="btn-outline !px-4 !py-2 text-sm"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline !px-4 !py-2 text-sm">Log in</Link>
              <Link to="/register" className="btn-accent !px-4 !py-2 text-sm">Get started</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
