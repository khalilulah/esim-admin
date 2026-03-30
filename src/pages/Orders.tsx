import React, { useEffect, useState } from "react";

import type { Order } from "../types/index";
import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
} from "../services/order.service";

const STATUS_OPTIONS: Order["status"][] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, status: Order["status"]) => {
    const updated = await updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
    if (selected?._id === id) setSelected(updated);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this order? This cannot be undone.")) return;
    await deleteOrder(id);
    setOrders((prev) => prev.filter((o) => o._id !== id));
    if (selected?._id === id) setSelected(null);
  };

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
        Orders
      </h2>

      <div className="flex gap-8">
        {/* Orders table */}
        <div className="flex-1 bg-white border border-neutral-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-200">
              <tr>
                {["Order ID", "Customer", "Total", "Status", "Date", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-4 uppercase tracking-widest text-xs text-neutral-400"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className={`border-b border-neutral-100 hover:bg-neutral-300 transition-colors ${
                    selected?._id === order._id ? "bg-primary-100" : ""
                  }`}
                >
                  <td className="px-6 py-4 font-mono text-xs">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4">{order.customer.email}</td>
                  <td className="px-6 py-4">
                    ₦{order.grandTotal.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          e.target.value as Order["status"],
                        )
                      }
                      className={`uppercase tracking-widest text-xs px-3 py-1 border-none outline-none cursor-pointer ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : order.status === "shipped"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-neutral-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <button
                        onClick={() =>
                          setSelected(
                            order._id === selected?._id ? null : order,
                          )
                        }
                        className="uppercase tracking-widest text-xs text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                      >
                        {selected?._id === order._id ? "Close" : "View"}
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="uppercase tracking-widest text-xs text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order detail panel */}
        {selected && (
          <div className="w-80 bg-white border border-neutral-200 p-6 shrink-0 self-start sticky top-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-league uppercase text-xl leading-none">
                Order Detail
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="text-neutral-400 hover:text-neutral-900 text-xl leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-4 text-sm">
              {/* Order number */}
              <div>
                <p className="uppercase tracking-widest text-xs text-neutral-400 mb-1">
                  Order
                </p>
                <p className="font-medium">{selected.orderNumber}</p>
              </div>

              <div className="h-px bg-neutral-100" />

              {/* Customer */}
              <div>
                <p className="uppercase tracking-widest text-xs text-neutral-400 mb-1">
                  Customer
                </p>
                <p>{selected.customer.name}</p>
                <p className="text-neutral-400">{selected.customer.email}</p>
                <p className="text-neutral-400">{selected.customer.phone}</p>
              </div>

              <div className="h-px bg-neutral-100" />

              {/* Delivery address — was missing */}
              <div>
                <p className="uppercase tracking-widest text-xs text-neutral-400 mb-1">
                  Delivery Address
                </p>
                <p className="text-neutral-600 leading-relaxed">
                  {selected.shippingAddress.street}
                  <br />
                  {selected.shippingAddress.city}
                  <br />
                  {selected.shippingAddress.state}
                </p>
              </div>

              <div className="h-px bg-neutral-100" />

              {/* Items */}
              <div>
                <p className="uppercase tracking-widest text-xs text-neutral-400 mb-3">
                  Items
                </p>
                <div className="flex flex-col gap-3">
                  {selected.items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <img
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        className="w-10 h-12 object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-xs">{item.name}</p>
                        <p className="text-neutral-400 text-xs">
                          x{item.quantity}
                        </p>
                      </div>
                      <p className="text-xs">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-neutral-100" />

              {/* Totals breakdown */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span>₦{selected.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Shipping</span>
                  <span>₦{selected.shippingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-league text-xl mt-1">
                  <span>Total</span>
                  <span>₦{selected.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
