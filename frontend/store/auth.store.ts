"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { tokenStorage } from "@/lib/api-client";
import { authService } from "@/services/auth.service";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await authService.login({ email, password });
          tokenStorage.set(res.accessToken, res.refreshToken);
          const user = await authService.me();
          set({ user, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const res = await authService.register(data);
          tokenStorage.set(res.accessToken, res.refreshToken);
          const user = await authService.me();
          set({ user, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch {
          // Always clear locally even if server call fails
        }
        tokenStorage.clear();
        set({ user: null, isAuthenticated: false });
      },

      fetchMe: async () => {
        const token = tokenStorage.getAccess();
        if (!token) return;
        set({ isLoading: true });
        try {
          const user = await authService.me();
          set({ user, isAuthenticated: true });
        } catch {
          tokenStorage.clear();
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "anvyra-auth",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
