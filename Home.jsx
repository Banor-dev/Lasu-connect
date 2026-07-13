import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../components/CategoryChip.jsx";

export default function Home() {
  return (
    <div>
      {/* Hero: the core thesis — need meets supply, right here in LASU's own community */}
      <section className="bg-ink text-parchment">
        <div className="max-w-6xl mx-auto px-5 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="pill bg-marigold text-ink mb-4">Built for the LASU community</p>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold leading-tight">
              Need something done? Someone nearby can do it.
            </h1>
            <p className="mt-5 text-lg text-parchment/80 max-w-md">
              Post what you need or list what you offer. Chat, agree, and pay — without ever leaving the app.
              No more chasing WhatsApp numbers or asking around campus.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/requests/new" className="btn-accent">Post what you need</Link>
              <Link to="/browse" className="btn-outline !border-parchment !text-parchment hover:!bg-parchment hover:!text-ink">
                Browse services
              </Link>
            </div>
          </div>

          <div className="card bg-ink-800 border-marigold/20 p-6">
            <p className="text-sm text-marigold font-mono mb-3">Live on the platform</p>
            <div className="space-y-3">
              {[
                { who: "Chidinma, Graphic design", area: "Iyana-Iba", status: "Responds within the hour" },
                { who: "TopClass Tutors", area: "LASU Main Gate", status: "4 open requests nearby" },
                { who: "Bayo's Photography", area: "Ojo", status: "12 bookings this month" },
              ].map((item) => (
                <div key={item.who} className="flex items-center justify-between bg-ink-700/60 rounded-lg px-4 py-3">
                  <div>
                    <p className="font-medium text-parchment">{item.who}</p>
                    <p className="text-xs text-parchment/60">{item.area}</p>
                  </div>
                  <span className="text-xs text-marigold font-mono">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <h2 className="text-2xl font-display font-bold mb-8">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Say what you need",
              copy: "Post a request or browse listings from people already offering that service around you.",
            },
            {
              title: "Chat it out, in-app",
              copy: "Message the person directly inside LASU Professional Connect — agree on price, timing, and details.",
            },
            {
              title: "Pay and get rated",
              copy: "Settle up securely through the platform, then leave a review that helps the next person decide.",
            },
          ].map((step, i) => (
            <div key={step.title} className="card p-6">
              <span className="font-mono text-marigold-600 text-sm">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display font-semibold text-lg mt-2 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-650">{step.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <h2 className="text-2xl font-display font-bold mb-6">What people are offering</h2>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              to={`/browse?category=${cat.value}`}
              className="pill hover:bg-marigold hover:text-ink transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
