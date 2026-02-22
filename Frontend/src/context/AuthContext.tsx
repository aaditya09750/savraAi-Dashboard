import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthUser } from '../types';
import { authApi } from '../services/authApi';
import { authStorage } from '../services/authStorage';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const token = authStorage.getToken();

      if (!token) {
        if (mounted) {
          setIsInitializing(false);
        }
        return;
      }

      try {
        const profile = await authApi.me();
        if (mounted) {
          setUser(profile);
        }
      } catch {
        authStorage.clearToken();
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    };

    void initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (username: string, password: string) => {
    const payload = await authApi.login({ username, password });
    authStorage.setToken(payload.token);
    setUser(payload.user);
  };

  const logout = () => {
    authStorage.clearToken();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isInitializing,
      login,
      logout,
    }),
    [user, isInitializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
};
