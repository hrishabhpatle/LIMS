import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getUsers, initializeData } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
  canAddComponents: boolean;
  canEditComponents: boolean;
  canManageUsers: boolean;
  canViewAllTransactions: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    initializeData();
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const users = getUsers();
    const foundUser = users.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
    login,
    logout,
    isAdmin: user?.role === 'Admin',
    canAddComponents: user?.role === 'Admin' || user?.role === 'Lab Technician',
    canEditComponents: user?.role === 'Admin',
    canManageUsers: user?.role === 'Admin',
    canViewAllTransactions: user?.role === 'Admin' || user?.role === 'Manufacturing Engineer'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};