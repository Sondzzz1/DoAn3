// Artist Service - API calls cho Họa sĩ
import apiClient from './api';

// Interface cho DTO backend
interface HoaSiViewDTO {
  id: string;
  tenHoaSi: string;
  tieuSu?: string;
  hinhAnh?: string;
}

interface HoaSiCreateDTO {
  tenHoaSi: string;
  tieuSu?: string;
  hinhAnh?: string;
}

interface HoaSiUpdateDTO {
  id: string;
  tenHoaSi: string;
  tieuSu?: string;
  hinhAnh?: string;
}

export const artistService = {
  // Lấy tất cả họa sĩ
  async getAllArtists(): Promise<HoaSiViewDTO[]> {
    try {
      const response = await apiClient.get<HoaSiViewDTO[]>('/HoaSi/get-all');
      return response.data;
    } catch (error) {
      console.error('Error fetching artists:', error);
      throw error;
    }
  },

  // Lấy họa sĩ theo ID
  async getArtistById(id: string): Promise<HoaSiViewDTO> {
    try {
      const response = await apiClient.get<HoaSiViewDTO>(`/HoaSi/get-by-id/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching artist:', error);
      throw error;
    }
  },

  // Tạo họa sĩ mới (Admin only)
  async createArtist(data: HoaSiCreateDTO): Promise<string> {
    try {
      const response = await apiClient.post('/HoaSi/create', data);
      return response.data.message;
    } catch (error: any) {
      console.error('Error creating artist:', error);
      throw new Error(error.response?.data?.message || 'Lỗi khi tạo họa sĩ');
    }
  },

  // Cập nhật họa sĩ (Admin only)
  async updateArtist(data: HoaSiUpdateDTO): Promise<string> {
    try {
      const response = await apiClient.put('/HoaSi/update', data);
      return response.data.message;
    } catch (error: any) {
      console.error('Error updating artist:', error);
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật họa sĩ');
    }
  },

  // Xóa họa sĩ (Admin only)
  async deleteArtist(id: string): Promise<string> {
    try {
      const response = await apiClient.delete(`/HoaSi/delete/${id}`);
      return response.data.message;
    } catch (error: any) {
      console.error('Error deleting artist:', error);
      throw new Error(error.response?.data?.message || 'Lỗi khi xóa họa sĩ');
    }
  },
};
