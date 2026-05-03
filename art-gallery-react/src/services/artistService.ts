// Artist Service - API calls cho Họa sĩ (Public)
import apiClient from './api';

// Interface khớp với HoaSiPublicResponse từ PublicController backend
interface HoaSiPublicResponse {
  maHoaSi: number;
  tenHoaSi: string;
  tieuSu?: string;
  anhDaiDien?: string;
  soTacPham: number;
}

export const artistService = {
  // Lấy tất cả họa sĩ (Public API)
  async getAllArtists(): Promise<HoaSiPublicResponse[]> {
    try {
      const response = await apiClient.get<HoaSiPublicResponse[]>('/hoa-si');
      return response.data;
    } catch (error) {
      console.error('Error fetching artists:', error);
      throw error;
    }
  },

  // Lấy họa sĩ theo ID (Public API)
  async getArtistById(id: number): Promise<HoaSiPublicResponse> {
    try {
      const response = await apiClient.get<HoaSiPublicResponse>(`/hoa-si/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching artist:', error);
      throw error;
    }
  },
};
