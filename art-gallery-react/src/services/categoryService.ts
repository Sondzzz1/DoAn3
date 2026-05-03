// Category Service - API calls cho Danh mục (Public)
import apiClient from './api';

// Interface khớp với DanhMucResponse từ PublicController backend
interface DanhMucPublicResponse {
  maDanhMuc: number;
  tenDanhMuc: string;
  moTa?: string;
}

export const categoryService = {
  // Lấy tất cả danh mục (Public API)
  async getAllCategories(): Promise<DanhMucPublicResponse[]> {
    try {
      const response = await apiClient.get<DanhMucPublicResponse[]>('/danh-muc');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
};
