import { useEffect, useState } from "react";
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

function StatusSelect({
  order,
  onChange,
}: {
  order: Order;
  onChange: (id: string, status: Order["status"]) => void;
}) {
  const color =
    order.status === "delivered"
      ? "bg-green-100 text-green-700"
      : order.status === "cancelled"
        ? "bg-red-100 text-red-700"
        : order.status === "shipped"
          ? "bg-blue-100 text-blue-700"
          : "bg-yellow-100 text-yellow-700";

  return (
    <select
      value={order.status}
      onChange={(e) => onChange(order._id, e.target.value as Order["status"])}
      className={`uppercase tracking-widest text-xs px-3 py-1 border-none outline-none cursor-pointer ${color}`}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

function OrderDetailPanel({
  order,
  onClose,
  onStatusChange,
  onDelete,
  // extra class so we can position it differently on mobile vs desktop
  className,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: Order["status"]) => void;
  onDelete: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={`bg-white border border-neutral-200 p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-league uppercase text-xl leading-none">
          Order Detail
        </h3>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-900 text-xl leading-none cursor-pointer"
        >
          ×
        </button>
      </div>

      <div className="flex flex-col gap-4 text-sm">
        <div>
          <p className="uppercase tracking-widest text-xs text-neutral-400 mb-1">
            Order
          </p>
          <p className="font-medium">{order.orderNumber}</p>
        </div>

        <div className="h-px bg-neutral-100" />

        <div>
          <p className="uppercase tracking-widest text-xs text-neutral-400 mb-1">
            Customer
          </p>
          <p>{order.customer.name}</p>
          <p className="text-neutral-400">{order.customer.email}</p>
          <p className="text-neutral-400">{order.customer.phone}</p>
        </div>

        <div className="h-px bg-neutral-100" />

        <div>
          <p className="uppercase tracking-widest text-xs text-neutral-400 mb-1">
            Delivery Address
          </p>
          <p className="text-neutral-600 leading-relaxed">
            {order.shippingAddress.street}
            <br />
            {order.shippingAddress.city}
            <br />
            {order.shippingAddress.state}
          </p>
        </div>

        <div className="h-px bg-neutral-100" />

        <div>
          <p className="uppercase tracking-widest text-xs text-neutral-400 mb-1">
            Status
          </p>
          <StatusSelect order={order} onChange={onStatusChange} />
        </div>

        <div className="h-px bg-neutral-100" />

        <div>
          <p className="uppercase tracking-widest text-xs text-neutral-400 mb-3">
            Items
          </p>
          <div className="flex flex-col gap-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-10 h-12 object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-xs">{item.name}</p>
                  <p className="text-neutral-400 text-xs">x{item.quantity}</p>
                </div>
                <p className="text-xs">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-neutral-100" />

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-neutral-400">
            <span>Subtotal</span>
            <span>₦{order.totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Shipping</span>
            <span>₦{order.shippingFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-league text-xl mt-1">
            <span>Total</span>
            <span>₦{order.grandTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="h-px bg-neutral-100" />

        <button
          onClick={() => onDelete(order._id)}
          className="w-full border border-red-200 text-red-400 hover:text-red-600 hover:border-red-400 py-2 uppercase tracking-widest text-xs transition-colors cursor-pointer"
        >
          Delete Order
        </button>
      </div>
    </div>
  );
}

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

  const toggleSelected = (order: Order) =>
    setSelected((prev) => (prev?._id === order._id ? null : order));

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
        Orders
      </h2>

      {/* ── Desktop layout (lg+): table + side panel ── */}
      <div className="hidden lg:flex gap-8">
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
                  className={`border-b border-neutral-100 hover:bg-neutral-50 transition-colors ${
                    selected?._id === order._id ? "bg-neutral-50" : ""
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
                    <StatusSelect order={order} onChange={handleStatusChange} />
                  </td>
                  <td className="px-6 py-4 text-neutral-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <button
                        onClick={() => toggleSelected(order)}
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

        {selected && (
          <OrderDetailPanel
            order={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            className="w-80 shrink-0 self-start sticky top-6"
          />
        )}
      </div>

      {/* ── Mobile layout (below lg): cards ── */}
      <div className="lg:hidden flex flex-col gap-3">
        {orders.map((order) => (
          <div key={order._id} className="bg-white border border-neutral-200">
            {/* Card summary row */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-xs text-neutral-500">
                  {order.orderNumber}
                </span>
                <StatusSelect order={order} onChange={handleStatusChange} />
              </div>
              <p className="text-sm truncate mb-1">{order.customer.email}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-league text-lg">
                  ₦{order.grandTotal.toLocaleString()}
                </span>
                <span className="text-xs text-neutral-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              {/* Actions */}
              <div className="flex gap-4 mt-3 pt-3 border-t border-neutral-100">
                <button
                  onClick={() => toggleSelected(order)}
                  className="uppercase tracking-widest text-xs text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  {selected?._id === order._id ? "Close" : "View Details"}
                </button>
                <button
                  onClick={() => handleDelete(order._id)}
                  className="uppercase tracking-widest text-xs text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Inline expanded detail */}
            {selected?._id === order._id && (
              <OrderDetailPanel
                order={selected}
                onClose={() => setSelected(null)}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                className="border-t border-neutral-200"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
