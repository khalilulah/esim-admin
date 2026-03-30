import api from "../lib/axios";
import type { Admin } from "../types/index";

interface LoginResponse {
  token: string;
  user: Admin;
}

export const loginAdmin = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });
  if (data.data.user.role !== "admin")
    throw new Error("Access denied — admins only");
  return data.data;
};
