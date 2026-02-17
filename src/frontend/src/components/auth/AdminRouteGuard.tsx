import React from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import AccessDeniedScreen from './AccessDeniedScreen';
import LoadingState from '../state/LoadingState';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'initializing';

  if (isInitializing || isCheckingAdmin) {
    return <LoadingState message="Checking permissions..." />;
  }

  if (!isAuthenticated) {
    return <AccessDeniedScreen reason="not-authenticated" />;
  }

  if (!isAdmin) {
    return <AccessDeniedScreen reason="not-admin" />;
  }

  return <>{children}</>;
}
