import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth';

interface PrivateRouteProps {
  element: React.ReactElement;
  allowedRoles?: string[];
}

export const PrivateRoute = ({ element, allowedRoles }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/acesso-negado" />;
  }

  return element;
};
