import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [authUser, setAuthUser] = useState(() =>
    JSON.parse(localStorage.getItem('admin_user') || 'null')
  );

  const login = useCallback((newToken, newUser) => {
    setToken(newToken);
    setAuthUser(newUser);
    localStorage.setItem('admin_token', newToken);
    localStorage.setItem('admin_user', JSON.stringify(newUser));
  }, []);

  const doLogout = useCallback(() => {
    setToken(null);
    setAuthUser(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, authUser, login, doLogout, isAuthenticated: Boolean(token) }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
