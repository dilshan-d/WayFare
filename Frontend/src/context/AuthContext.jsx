import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { formatCurrency as formatCurr } from '../utils/formatters';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(() => localStorage.getItem('wayfare_currency') || 'USD');

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getCurrentUser();
      if (storedUser && storedUser.token) {
        try {
          const freshData = await authService.getMe();
          setUser((prev) => ({ ...prev, ...freshData }));
        } catch (error) {
          console.error('Session validation error:', error);
          if (error.response && error.response.status === 401) {
            authService.logout();
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('wayfare_currency', newCurrency);
  };

  const formatPrice = (amount) => {
    return formatCurr(amount, currency);
  };

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUserProfile = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const value = {
    user,
    loading,
    currency,
    changeCurrency,
    formatPrice,
    login,
    register,
    logout,
    updateUserProfile,
    isAdmin: user?.role === 'admin' || user?.isAdmin === true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
