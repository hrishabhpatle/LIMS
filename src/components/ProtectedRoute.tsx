import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  requirePermission?: 'canAddComponents' | 'canEditComponents' | 'canManageUsers' | 'canViewAllTransactions';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false, requirePermission }) => {
  const { user, isAdmin, canAddComponents, canEditComponents, canManageUsers, canViewAllTransactions } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requirePermission) {
    const permissions = {
      canAddComponents,
      canEditComponents,
      canManageUsers,
      canViewAllTransactions
    };
    
    if (!permissions[requirePermission]) {
      return <Navigate to="/" replace />;
    }
  }
  return <>{children}</>;
};

export default ProtectedRoute;