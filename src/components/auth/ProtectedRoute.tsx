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

  // If we're still checking the user's authentication status, show loading
  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        Loading...
      </div>
    );
  }

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // If there's a role requirement and the user doesn't have that role
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect farmers to their dashboard
    if (user?.role === 'farmer') {
      return <Navigate to='/dashboard/farmer' replace />;
    }
    // Redirect regular users to the main page
    return <Navigate to='/' replace />;
  }

  // If the user has no role yet, redirect to role selection
  if (user?.role === null) {
    return <Navigate to='/select-role' replace />;
  }

  // If the user is authenticated with the correct role, render the children
  return <>{children}</>;
};
