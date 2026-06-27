import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireSuperAdmin = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" />;
  }

  // التحقق من أن المستخدم Admin
  if (!user.isAdmin && !user.isSuperAdmin) {
    return <Navigate to="/login" />;
  }

  // التحقق من صلاحية Super Admin
  if (requireSuperAdmin && !user.isSuperAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;