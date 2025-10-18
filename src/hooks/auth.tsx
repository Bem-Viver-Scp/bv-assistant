import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { key } from '../config/key';
import api from '../services/api';
import type { User } from '../dtos';

interface AuthState {
  token: string;
  refresh_token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  updateUser: (user: User) => void;
  signOut: () => void;
  isAuthenticated: boolean;
  user: User;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [data, setData] = useState<AuthState>(() => {
    const refresh_token = localStorage.getItem(key.refreshToken);
    const token = localStorage.getItem(key.token);
    const user = localStorage.getItem(key.user);

    if (token && user && refresh_token) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user), refresh_token };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(
    async ({ email, password }: SignInCredentials) => {
      const response = await api.post('sessions', { email, password });

      const { token, user, refresh_token } = response.data;

      localStorage.setItem(key.refreshToken, refresh_token);
      localStorage.setItem(key.token, token);
      localStorage.setItem(key.user, JSON.stringify(user));

      api.defaults.headers.authorization = `Bearer ${token}`;
      setData({ token, user, refresh_token });

      navigate('/dashboard');
    },
    [navigate]
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(key.refreshToken);
    localStorage.removeItem(key.token);
    localStorage.removeItem(key.user);

    setData({} as AuthState);
    navigate('/');
  }, [navigate]);

  const updateUser = (user: User) => {
    localStorage.setItem(key.user, JSON.stringify(user));
    setData((prev) => ({ ...prev, user }));
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isAuthenticated: !!data.user,
        user: data.user,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  return context;
}
