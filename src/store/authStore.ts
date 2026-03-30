import { create } from "zustand";
import type { Admin } from "../types/index";

interface AuthStore {
  admin: Admin | null;
  token: string | null;
  setAuth: (admin: Admin, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  admin: null,
  token: localStorage.getItem("adminToken"),

  setAuth: (admin, token) => {
    localStorage.setItem("adminToken", token);
    set({ admin, token });
  },

  logout: () => {
    localStorage.removeItem("adminToken");
    set({ admin: null, token: null });
  },
}));
