import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'consumer' | 'farmer';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (!isLoading && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (!isLoading && requiredRole && user?.role !== requiredRole) {
    if (user?.role === 'farmer') {
      return <Navigate to='/dashboard/farmer' replace />;
    }
    return <Navigate to='/' replace />;
  }

  if (
    !isLoading &&
    user?.role === null &&
    location.pathname !== '/select-role'
  ) {
    return <Navigate to='/select-role' replace />;
  }

  return <>{children}</>;
};
