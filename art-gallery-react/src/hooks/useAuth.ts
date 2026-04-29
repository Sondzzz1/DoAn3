// Custom Hook cho Authentication - Kết nối với Backend API
import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { authService } from '../services/authService';

const ADMIN_EMAIL = 'admin@artgallery.com';
const ADMIN_PASSWORD = 'admin123';

export const useAuth = () => {
  const { user, setUser } = useAppContext();

  // Login function - Kết nối với Backend
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      // Kiểm tra admin (hardcoded)
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser = {
          id: 'admin-001',
          email: ADMIN_EMAIL,
          name: 'Quản trị viên',
          role: 'admin' as const,
        };
        setUser(adminUser);
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        localStorage.setItem('authToken', 'admin_token');
        return true;
      }

      // Login thông thường qua API
      const loggedInUser = await authService.login(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Đăng nhập thất bại');
      return false;
    }
  }, [setUser]);

  // Logout function
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, [setUser]);

  // Register function - Kết nối với Backend
  const register = useCallback(async (
    email: string,
    password: string,
    name: string,
    phone: string,
    address?: string
  ): Promise<boolean> => {
    try {
      const newUser = await authService.register(email, password, name, phone, address);
      setUser(newUser);
      return true;
    } catch (error: any) {
      console.error('Register error:', error);
      alert(error.message || 'Đăng ký thất bại');
      return false;
    }
  }, [setUser]);

  return {
    user,
    setUser,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isAuthor: user?.role === 'author',
  };
};
