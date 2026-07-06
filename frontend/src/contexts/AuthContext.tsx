import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'manager' | 'worker';
  businessType: string | null;
}

interface AuthContextProps {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setBusinessType: (businessType: string) => Promise<void>;
  switchRole: (role: 'admin' | 'manager' | 'worker') => Promise<void>;
  updateUserContext: (updates: Partial<User>) => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('karyukti-token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('karyukti-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [geminiApiKey, setGeminiApiKeyState] = useState<string>(() => {
    return localStorage.getItem('karyukti-gemini-key') || '';
  });
  const [loading, setLoading] = useState(true);

  const setGeminiApiKey = (key: string) => {
    setGeminiApiKeyState(key);
    localStorage.setItem('karyukti-gemini-key', key);
  };

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('karyukti-token', newToken);
    localStorage.setItem('karyukti-user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('karyukti-token');
    localStorage.removeItem('karyukti-user');
  };

  const switchRole = async (role: 'admin' | 'manager' | 'worker') => {
    try {
      const email = `${role}@agentforce.com`;
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password: 'password123' })
      });
      if (res.ok) {
        const data = await res.json();
        login(data.token, data.user);
      }
    } catch (err) {
      console.error('Failed to switch role silently:', err);
    }
  };

  const updateUserContext = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('karyukti-user', JSON.stringify(updated));
    }
  };

  const setBusinessType = async (businessType: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ businessType })
      });
      if (res.ok) {
        updateUserContext({ businessType });
      }
    } catch (err) {
      console.error('Failed to update business type on server:', err);
      updateUserContext({ businessType });
    }
  };

  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        // Run auto-login to bypass login page barrier
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin@agentforce.com', password: 'password123' })
          });
          if (res.ok) {
            const data = await res.json();
            login(data.token, data.user);
          }
        } catch (err) {
          console.error('Silent auto login failed:', err);
        } finally {
          setLoading(false);
        }
        return;
      }
      try {
        const res = await fetch('/api/auth/session', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          localStorage.setItem('karyukti-user', JSON.stringify(data));
        } else {
          logout();
        }
      } catch (err) {
        console.error('Session validation error:', err);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [token]);

  return (
    <AuthContext.Provider value={{
      token,
      user,
      loading,
      login,
      logout,
      setBusinessType,
      updateUserContext,
      geminiApiKey,
      setGeminiApiKey,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
