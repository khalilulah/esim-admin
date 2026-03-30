import api from "../lib/axios";
import type { Order } from "../types/index";

export const getOrders = async (): Promise<Order[]> => {
  const { data } = await api.get("/orders");
  return data.data;
};

export const deleteOrder = async (id: string): Promise<void> => {
  await api.delete(`/orders/${id}`);
};

export const updateOrderStatus = async (
  id: string,
  status: Order["status"],
): Promise<Order> => {
  const { data } = await api.patch(`/orders/${id}/status`, { status });
  return data.data;
};
