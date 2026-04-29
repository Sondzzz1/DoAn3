// Category Service - API calls cho Loại tranh
import apiClient from './api';

// Interface cho DTO backend
interface LoaiTranhViewDTO {
  id: string;
  tenLoai: string;
  moTa?: string;
}

interface LoaiTranhCreateDTO {
  tenLoai: string;
  moTa?: string;
}

interface LoaiTranhUpdateDTO {
  id: string;
  tenLoai: string;
  moTa?: string;
}

export const categoryService = {
  // Lấy tất cả loại tranh
  async getAllCategories(): Promise<LoaiTranhViewDTO[]> {
    try {
      const response = await apiClient.get<LoaiTranhViewDTO[]>('/LoaiTranh/get-all');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Lấy loại tranh theo ID
  async getCategoryById(id: string): Promise<LoaiTranhViewDTO> {
    try {
      const response = await apiClient.get<LoaiTranhViewDTO>(`/LoaiTranh/get-by-id/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  // Tạo loại tranh mới (Admin only)
  async createCategory(data: LoaiTranhCreateDTO): Promise<string> {
    try {
      const response = await apiClient.post('/LoaiTranh/create', data);
      return response.data.message;
    } catch (error: any) {
      console.error('Error creating category:', error);
      throw new Error(error.response?.data?.message || 'Lỗi khi tạo loại tranh');
    }
  },

  // Cập nhật loại tranh (Admin only)
  async updateCategory(data: LoaiTranhUpdateDTO): Promise<string> {
    try {
      const response = await apiClient.put('/LoaiTranh/update', data);
      return response.data.message;
    } catch (error: any) {
      console.error('Error updating category:', error);
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật loại tranh');
    }
  },

  // Xóa loại tranh (Admin only)
  async deleteCategory(id: string): Promise<string> {
    try {
      const response = await apiClient.delete(`/LoaiTranh/delete/${id}`);
      return response.data.message;
    } catch (error: any) {
      console.error('Error deleting category:', error);
      throw new Error(error.response?.data?.message || 'Lỗi khi xóa loại tranh');
    }
  },
};
