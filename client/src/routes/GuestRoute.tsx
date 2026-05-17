import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';

export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner label="Loading…" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
