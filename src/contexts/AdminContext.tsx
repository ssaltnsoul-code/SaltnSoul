import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
}

interface AdminContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admin_token');
      const userData = localStorage.getItem('admin_user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Invalid user data in localStorage');
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo admin credentials - in production, this would be an API call
      const validAdmins = [
        {
          email: 'admin@saltndsoul.com',
          password: 'admin123',
          user: {
            id: '1',
            email: 'admin@saltndsoul.com',
            name: 'Store Admin',
            role: 'super_admin' as const
          }
        },
        {
          email: 'manager@saltndsoul.com',
          password: 'manager123',
          user: {
            id: '2',
            email: 'manager@saltndsoul.com',
            name: 'Store Manager',
            role: 'admin' as const
          }
        }
      ];

      const admin = validAdmins.find(a => a.email === email && a.password === password);
      
      if (admin) {
        // Generate a mock JWT token
        const token = 'admin_' + Math.random().toString(36).substr(2, 9);
        
        // Store auth data
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(admin.user));
        
        setUser(admin.user);
        
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${admin.user.name}!`,
        });
        
        return true;
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      toast({
        title: 'Login Error',
        description: 'An error occurred during login',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
    
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out',
    });
  };

  const value: AdminContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}