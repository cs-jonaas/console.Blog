import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check if user is authenticated
  const isAuth = isAuthenticated();

  // If authenticated, render the children (the protected page)
  // If not, redirect to the signin page
  return isAuth ? <>{children}</> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;