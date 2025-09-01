import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Loader2 } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'super_admin';
}

export function AdminProtectedRoute({ 
  children, 
  requiredRole = 'admin' 
}: AdminProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/admin');
        return;
      }

      // Check role permissions
      if (requiredRole === 'super_admin' && user?.role !== 'super_admin') {
        // Redirect to admin dashboard if insufficient permissions
        navigate('/admin/dashboard');
        return;
      }
    }
  }, [isAuthenticated, loading, user, requiredRole, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (requiredRole === 'super_admin' && user?.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Insufficient permissions...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}