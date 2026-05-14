import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminSales = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");

      try {
        const accessToken = localStorage.getItem("accessToken");

        const res = await axios.get(
          "http://localhost:8000/api/v1/order/dashboard",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

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

  const items = [
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      color: "bg-pink-100",
      text: "text-pink-700",
      link: "/dashboard/orders",
    },
    {
      label: "Total Revenue",
      value: stats
        ? `₹${stats.totalRevenue.toLocaleString()}`
        : "₹0",
      color: "bg-emerald-100",
      text: "text-emerald-700",
      link: "/dashboard/sales",
    },
    {
      label: "Total Products",
      value: stats?.totalProducts ?? 0,
      color: "bg-violet-100",
      text: "text-violet-700",
      link: "/dashboard/products",
    },
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      color: "bg-sky-100",
      text: "text-sky-700",
      link: "/dashboard/users",
    },
    {
      label: "Pending Orders",
      value: stats?.pendingOrders ?? 0,
      color: "bg-yellow-100",
      text: "text-yellow-700",
      link: "/dashboard/orders",
    },
    {
      label: "Processing Orders",
      value: stats?.processingOrders ?? 0,
      color: "bg-blue-100",
      text: "text-blue-700",
      link: "/dashboard/orders",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-24 md:ml-[275px]">
      
      {/* Header */}
      <div className="mb-8 md:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
          Dashboard overview with orders, revenue, products, and user activity.
          Refresh the page to reload stats.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5 text-sm sm:text-base text-red-700">
          {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-36 rounded-3xl bg-white animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          
          {items.map((card) => (
            <div
              key={card.label}
              role="button"
              onClick={() => navigate(card.link)}
              className={`
                cursor-pointer
                rounded-3xl
                border
                border-gray-200
                ${card.color}
                p-5 sm:p-6
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
              `}
            >
              
              {/* Card Label */}
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-gray-700">
                {card.label}
              </p>

              {/* Card Value */}
              <p
                className={`
                  mt-5
                  text-3xl sm:text-4xl
                  font-bold
                  break-words
                  ${card.text}
                `}
              >
                {card.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSales;