import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, saveToken, saveUser, clearAuth } from '../utils/authStorage';
import { loginApi, registerApi, getCurrentUserApi } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUserState] = useState(() => getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      if (storedToken) {
        try {
          const userData = await getCurrentUserApi();
          setUserState(userData);
          saveUser(userData);
        } catch (err) {
          console.error('Failed to verify session:', err);
          clearAuth();
          setTokenState(null);
          setUserState(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await loginApi({ email, password });
    const { token: jwtToken, ...userData } = response;
    
    saveToken(jwtToken);
    saveUser(userData);
    setTokenState(jwtToken);
    setUserState(userData);
    return response;
  };

  const register = async (registerData) => {
    const response = await registerApi(registerData);
    const { token: jwtToken, ...userData } = response;

    saveToken(jwtToken);
    saveUser(userData);
    setTokenState(jwtToken);
    setUserState(userData);
    return response;
  };

  const logout = () => {
    clearAuth();
    setTokenState(null);
    setUserState(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ADMIN',
    isStudent: user?.role === 'STUDENT',
    login,
    register,
    logout,
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
