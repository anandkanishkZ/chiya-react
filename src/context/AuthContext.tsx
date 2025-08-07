import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  user: { name: string; role: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('chiya-auth');
    if (auth) {
      setIsAuthenticated(true);
      setUser(JSON.parse(localStorage.getItem('chiya-user') || '{}'));
    }
  }, []);

  const login = (username: string, password: string) => {
    // Simple authentication - replace with real authentication
    if (username === 'admin' && password === 'chiya123') {
      setIsAuthenticated(true);
      const userData = { name: 'Admin', role: 'Administrator' };
      setUser(userData);
      localStorage.setItem('chiya-auth', 'true');
      localStorage.setItem('chiya-user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('chiya-auth');
    localStorage.removeItem('chiya-user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}