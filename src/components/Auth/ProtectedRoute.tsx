import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/auth', { replace: true });
    }
  }, [navigate]);

  if (!authService.isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
};