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
        className="font-league uppercase leading-none mb-10"
        style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
      >
        Dashboard
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 border border-neutral-200"
          >
            <p className="uppercase tracking-widest text-xs text-neutral-400 mb-2">
              {stat.label}
            </p>
            <p className="font-league text-4xl leading-none">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <h3 className="font-league uppercase text-2xl leading-none mb-6">
        Recent Orders
      </h3>
      <div className="bg-white border border-neutral-200 overflow-x-auto">
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
                className="border-b border-neutral-100 hover:bg-neutral-300"
              >
                <td className="px-6 py-4 font-mono text-xs">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4">{order.customer.email}</td>
                <td className="px-6 py-4">
                  ₦{order.grandTotal.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`uppercase tracking-widest text-xs px-3 py-1 ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : order.status === "shipped"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-neutral-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
