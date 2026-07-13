import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Browse from "./pages/Browse.jsx";
import Requests from "./pages/Requests.jsx";
import ServiceDetail from "./pages/ServiceDetail.jsx";
import RequestDetail from "./pages/RequestDetail.jsx";
import PostService from "./pages/PostService.jsx";
import PostRequest from "./pages/PostRequest.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ChatList from "./pages/ChatList.jsx";
import ChatWindow from "./pages/ChatWindow.jsx";
import Profile from "./pages/Profile.jsx";
import PaymentCallback from "./pages/PaymentCallback.jsx";
import MyPayments from "./pages/MyPayments.jsx";
import Wallet from "./pages/Wallet.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/requests/:id" element={<RequestDetail />} />
          <Route path="/payment/callback" element={<PaymentCallback />} />

          <Route path="/services/new" element={<ProtectedRoute><PostService /></ProtectedRoute>} />
          <Route path="/requests/new" element={<ProtectedRoute><PostRequest /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
          <Route path="/chat/:id" element={<ProtectedRoute><ChatWindow /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><MyPayments /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<div className="max-w-2xl mx-auto px-5 py-24 text-center text-slate-650">Page not found.</div>} />
        </Routes>
      </main>
    </div>
  );
}
