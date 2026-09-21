import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationItemId, UserRole, canRoleAccessView, hasRole } from '../../types';
import { LoginPage } from '../auth/LoginPage';
import { AccessRestrictedView } from './AccessRestrictedView';

interface ProtectedRouteProps {
  requiredView?: NavigationItemId;
  allowedRoles?: UserRole | UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredView,
  allowedRoles,
  children,
}) => {
  const { isAuthenticated, currentRole, currentView } = useApp();

  // 1. If not authenticated, render login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // 2. Check role permission for the attempted view
  const viewToCheck = requiredView || currentView;
  if (viewToCheck && !canRoleAccessView(currentRole, viewToCheck)) {
    return <AccessRestrictedView attemptedView={viewToCheck} />;
  }

  // 3. Check explicit allowedRoles if provided
  if (allowedRoles && !hasRole(currentRole, allowedRoles)) {
    return <AccessRestrictedView attemptedView={viewToCheck} />;
  }

  return <>{children}</>;
};
