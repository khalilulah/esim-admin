import React, { useEffect, useState } from "react";
import { getProducts } from "../services/product.service";
import { getOrders } from "../services/order.service";
import type { Order } from "../types/index";

interface Stat {
  label: string;
  value: string | number;
}

function Dashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, orders] = await Promise.all([
          getProducts(),
          getOrders(),
        ]);
        const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
        const pendingOrders = orders.filter(
          (o) => o.status === "pending",
        ).length;

        setStats([
          { label: "Total Products", value: products.length },
          { label: "Total Orders", value: orders.length },
          { label: "Pending Orders", value: pendingOrders },
          {
            label: "Total Revenue",
            value: `₦${totalRevenue.toLocaleString()}`,
          },
        ]);
        setRecentOrders(orders.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="uppercase tracking-widest text-neutral-400 text-sm">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2
        className="font-league uppercase leading-none mb-8"
        style={{ fontSize: "clamp(32px, 5vw, 72px)" }}
      >
        Dashboard
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-4 sm:p-6 border border-neutral-200"
          >
            <p className="uppercase tracking-widest text-xs text-neutral-400 mb-2">
              {stat.label}
            </p>
            <p className="font-league text-3xl sm:text-4xl leading-none break-words">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <h3 className="font-league uppercase text-2xl leading-none mb-6">
        Recent Orders
      </h3>

      {/* ── Desktop table (sm+) ── */}
      <div className="hidden sm:block bg-white border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200">
            <tr>
              {["Order ID", "Customer", "Total", "Status", "Date"].map((h) => (
                <th
                  key={h}
                  className="text-left px-6 py-4 uppercase tracking-widest text-xs text-neutral-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-neutral-100 hover:bg-neutral-50"
              >
                <td className="px-6 py-4 font-mono text-xs">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4">{order.customer.email}</td>
                <td className="px-6 py-4">
                  ₦{order.grandTotal.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 text-neutral-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards (below sm) ── */}
      <div className="sm:hidden flex flex-col gap-3">
        {recentOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-neutral-200 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-neutral-500">
                {order.orderNumber}
              </span>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm mb-1 truncate">{order.customer.email}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-league text-lg">
                ₦{order.grandTotal.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "delivered"
      ? "bg-green-100 text-green-700"
      : status === "cancelled"
        ? "bg-red-100 text-red-700"
        : status === "shipped"
          ? "bg-blue-100 text-blue-700"
          : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`uppercase tracking-widest text-xs px-3 py-1 ${color}`}>
      {status}
    </span>
  );
}

export default Dashboard;
