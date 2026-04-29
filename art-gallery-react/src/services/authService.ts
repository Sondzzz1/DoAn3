// Auth Service - Xác thực người dùng
import { customerService } from './customerService';
import { User } from '../types';

// Lưu ý: Backend hiện tại chưa có API authentication thực sự
// Đây là implementation tạm thời sử dụng localStorage và KhachHang API

export const authService = {
  // Đăng nhập
  async login(email: string, password: string): Promise<User | null> {
    try {
      // Kiểm tra tài khoản trong localStorage trước (admin, artist, user mẫu)
      const storedAccount = localStorage.getItem(`user_account_${email}`);
      if (storedAccount) {
        const account = JSON.parse(storedAccount);
        
        // Kiểm tra mật khẩu
        if (account.password !== password) {
          throw new Error('Mật khẩu không đúng');
        }

        const user: User = {
          id: account.id || email,
          email: account.email,
          name: account.name,
          phone: account.phone,
          address: account.address,
          role: account.role,
          bio: account.bio,
          specialization: account.specialization,
          website: account.website,
          facebook: account.facebook,
          instagram: account.instagram,
        };

        // Lưu vào localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authToken', `token_${email}`);
        sessionStorage.setItem('userRole', user.role);

        return user;
      }

      // Nếu không có trong localStorage, tìm trong API backend
      const customer = await customerService.getCustomerByEmail(email);
      
      if (!customer) {
        throw new Error('Email không tồn tại');
      }

      // Lưu ý: Backend chưa có password validation
      // Tạm thời chấp nhận mọi password (CHỈ ĐỂ DEMO)
      
      const user: User = {
        id: customer.id,
        email: customer.email,
        name: customer.hoTen,
        phone: customer.soDienThoai,
        address: customer.diaChi,
        role: 'user',
      };

      // Lưu vào localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', `temp_token_${customer.id}`);
      sessionStorage.setItem('userRole', 'user');

      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Đăng ký
  async register(
    email: string,
    password: string,
    name: string,
    phone: string,
    address?: string
  ): Promise<User> {
    try {
      // Kiểm tra email đã tồn tại chưa
      const existingCustomer = await customerService.getCustomerByEmail(email);
      if (existingCustomer) {
        throw new Error('Email đã được sử dụng');
      }

      // Tạo khách hàng mới
      await customerService.createCustomer({
        hoTen: name,
        email: email,
        soDienThoai: phone,
        diaChi: address,
      });

      // Lấy thông tin khách hàng vừa tạo
      const newCustomer = await customerService.getCustomerByEmail(email);
      if (!newCustomer) {
        throw new Error('Lỗi khi tạo tài khoản');
      }

      const user: User = {
        id: newCustomer.id,
        email: newCustomer.email,
        name: newCustomer.hoTen,
        phone: newCustomer.soDienThoai,
        address: newCustomer.diaChi,
        role: 'user',
      };

      // Lưu vào localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', `temp_token_${newCustomer.id}`);

      return user;
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Đăng xuất
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  },

  // Lấy user hiện tại từ localStorage
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('currentUser');
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },
};
