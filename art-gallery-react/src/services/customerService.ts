// Customer Service - API calls cho Khách hàng
import apiClient from './api';

// Interface cho DTO backend
interface KhachHangViewDTO {
  id: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  diaChi?: string;
  ngayDangKy: string;
}

interface KhachHangCreateDTO {
  hoTen: string;
  email: string;
  soDienThoai: string;
  diaChi?: string;
}

interface KhachHangUpdateDTO {
  id: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  diaChi?: string;
}

export const customerService = {
  // Lấy tất cả khách hàng
  async getAllCustomers(): Promise<KhachHangViewDTO[]> {
    try {
      const response = await apiClient.get<KhachHangViewDTO[]>('/KhachHang/get-all');
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  // Lấy khách hàng theo ID
  async getCustomerById(id: string): Promise<KhachHangViewDTO> {
    try {
      const response = await apiClient.get<KhachHangViewDTO>(`/KhachHang/get-by-id/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  // Tạo khách hàng mới (Đăng ký)
  async createCustomer(data: KhachHangCreateDTO): Promise<string> {
    try {
      const response = await apiClient.post('/KhachHang/create', data);
      return response.data.message;
    } catch (error: any) {
      console.error('Error creating customer:', error);
      throw new Error(error.response?.data?.message || 'Lỗi khi tạo khách hàng');
    }
  },

  // Cập nhật thông tin khách hàng
  async updateCustomer(data: KhachHangUpdateDTO): Promise<string> {
    try {
      const response = await apiClient.put('/KhachHang/update', data);
      return response.data.message;
    } catch (error: any) {
      console.error('Error updating customer:', error);
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật khách hàng');
    }
  },

  // Xóa khách hàng (Admin only)
  async deleteCustomer(id: string): Promise<string> {
    try {
      const response = await apiClient.delete(`/KhachHang/delete/${id}`);
      return response.data.message;
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      throw new Error(error.response?.data?.message || 'Lỗi khi xóa khách hàng');
    }
  },

  // Tìm khách hàng theo email (cho login)
  async getCustomerByEmail(email: string): Promise<KhachHangViewDTO | null> {
    try {
      const customers = await this.getAllCustomers();
      return customers.find(c => c.email.toLowerCase() === email.toLowerCase()) || null;
    } catch (error) {
      console.error('Error finding customer by email:', error);
      return null;
    }
  },
};
