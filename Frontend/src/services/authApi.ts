import { authClient } from "./authClient";
import type { AuthUser } from "../types";

interface LoginRequest {
  username: string;
  password: string;
}

export const authApi = {
  async login(payload: LoginRequest): Promise<any> {
    const { data, error } = await authClient.signIn.username({
      username: payload.username,
      password: payload.password,
    });

    if (error) {
      throw new Error(error.message || "Login failed");
    }

    return data;
  },

  async me(): Promise<AuthUser> {
    const { data, error } = await authClient.getSession();

    if (error || !data?.user) {
      throw new Error("Not authenticated");
    }

    // Map BetterAuth user fields to existing AuthUser interface
    return {
      id: data.user.id,
      username: data.user.name,
      role: (data.user as any).role || "ADMIN",
      lastLoginAt: (data.user as any).lastLoginAt || null,
    };
  },

  async logout(): Promise<void> {
    await authClient.signOut();
  },
};
