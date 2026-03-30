import api from "../lib/axios";
import type { Product } from "../types/index";

export const getProducts = async (): Promise<Product[]> => {
  const { data } = await api.get("/products", {
    params: { limit: 1000 }, // high limit — get everything in one shot
  });
  return data.data.products; // extract just the array
};

export const createProduct = async (formData: FormData): Promise<Product> => {
  const { data } = await api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const updateProduct = async (
  id: string,
  formData: FormData,
): Promise<Product> => {
  const { data } = await api.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};
