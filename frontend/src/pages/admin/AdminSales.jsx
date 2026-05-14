import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminSales = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");

      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:8000/api/v1/order/dashboard", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.data.success) {
          setStats(res.data.stats);
        } else {
          setError(res.data.message || "Unable to load dashboard stats.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard stats. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const navigate = useNavigate();

  const items = [
    { label: "Total Orders", value: stats?.totalOrders ?? 0, color: "bg-pink-100 text-pink-700", link: "/dashboard/orders" },
    { label: "Total Revenue", value: stats ? `₹${stats.totalRevenue.toLocaleString()}` : "₹0", color: "bg-emerald-100 text-emerald-700", link: "/dashboard/sales" },
    { label: "Total Products", value: stats?.totalProducts ?? 0, color: "bg-violet-100 text-violet-700", link: "/dashboard/products" },
    { label: "Total Users", value: stats?.totalUsers ?? 0, color: "bg-sky-100 text-sky-700", link: "/dashboard/users" },
    { label: "Pending Orders", value: stats?.pendingOrders ?? 0, color: "bg-yellow-100 text-yellow-800", link: "/dashboard/orders" },
    { label: "Processing Orders", value: stats?.processingOrders ?? 0, color: "bg-blue-100 text-blue-800", link: "/dashboard/orders" },
  ];

  return (
    <div className="py-20 pr-20 min-h-screen bg-gray-100" style={{ paddingLeft: 350 }}>
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Dashboard overview with orders, revenue, products, and user activity. Refresh the page to reload stats.
        </p>
      </div>

      {error && (
        <div className="mb-8 rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-3xl bg-white" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((card) => (
            <div
              key={card.label}
              role="button"
              onClick={() => navigate(card.link)}
              className={`cursor-pointer rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 ${card.color}`}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-700">{card.label}</p>
              <p className="mt-6 text-4xl font-bold text-slate-900">{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSales;
