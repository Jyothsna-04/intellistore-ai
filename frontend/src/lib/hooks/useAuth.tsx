import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import apiClient, { extractData } from '../apiClient';
import { queryClient } from '../queryClient';

// ── Types ──────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  storageUsedBytes: number;
  storageQuotaBytes: number;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
}

// ── Context ────────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('intellistore_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('intellistore_token')
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/api/auth/login', { email, password });
      const data = extractData<any>(response);

      const authUser: AuthUser = {
        id:                data.userId || data.id,
        email:             data.email,
        firstName:         data.firstName || '',
        lastName:          data.lastName || '',
        roles:             data.roles || [],
        storageUsedBytes:  data.storageUsedBytes || 0,
        storageQuotaBytes: data.storageQuotaBytes || 10737418240, // 10GB default
      };

      localStorage.setItem('intellistore_token', data.token || data.accessToken);
      localStorage.setItem('intellistore_user', JSON.stringify(authUser));

      setToken(data.token || data.accessToken);
      setUser(authUser);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        ...data,
        fullName: `${data.firstName} ${data.lastName}`.trim(),
      };
      const response = await apiClient.post('/api/auth/register', payload);
      const result = extractData<any>(response);

      const authUser: AuthUser = {
        id:                result.userId || result.id,
        email:             result.email,
        firstName:         data.firstName,
        lastName:          data.lastName,
        roles:             result.roles || ['ROLE_USER'],
        storageUsedBytes:  0,
        storageQuotaBytes: 10737418240,
      };

      localStorage.setItem('intellistore_token', result.token || result.accessToken);
      localStorage.setItem('intellistore_user', JSON.stringify(authUser));

      setToken(result.token || result.accessToken);
      setUser(authUser);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Registration failed.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('intellistore_token');
    localStorage.removeItem('intellistore_user');
    setToken(null);
    setUser(null);
    // Clear all cached queries on logout
    queryClient.clear();
    window.location.href = '/login';
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      error,
      login,
      register,
      logout,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Hook ───────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
