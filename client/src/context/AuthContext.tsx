import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as authApi from '../api/auth.api';
import { ApiRequestError } from '../api/client';
import type { LoginFormValues, RegisterFormValues } from '../schemas/auth.schema';
import type { UserPublic } from '../types/user';
import { clearToken, getToken, setToken } from '../utils/token';

interface AuthContextValue {
  user: UserPublic | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginFormValues) => Promise<void>;
  register: (input: RegisterFormValues) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const storedToken = getToken();
    if (!storedToken) {
      setUser(null);
      setTokenState(null);
      return;
    }

    const profile = await authApi.fetchCurrentUser();
    setUser(profile);
    setTokenState(storedToken);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        if (getToken()) {
          await refreshUser();
        }
      } catch (error) {
        if (error instanceof ApiRequestError && error.statusCode === 401) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    void init();
  }, [logout, refreshUser]);

  const login = useCallback(
    async (input: LoginFormValues) => {
      const { user: loggedInUser, token: authToken } = await authApi.loginUser(input);
      setToken(authToken);
      setTokenState(authToken);
      setUser(loggedInUser);
    },
    [],
  );

  const register = useCallback(
    async (input: RegisterFormValues) => {
      const { name, email, password } = input;
      const { user: registeredUser, token: authToken } = await authApi.registerUser({
        name,
        email,
        password,
      });
      setToken(authToken);
      setTokenState(authToken);
      setUser(registeredUser);
    },
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
    }),
    [user, token, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
