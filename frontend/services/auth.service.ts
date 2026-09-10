import { api } from "@/lib/api-client";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types";

export const authService = {
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>("/auth/register", data, { auth: false }),

  login: (data: LoginRequest) =>
    api.post<AuthResponse>("/auth/login", data, { auth: false }),

  logout: () => api.delete<void>("/auth/logout"),

  me: () => api.get<User>("/users/me"),
};
