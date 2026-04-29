// Artwork Service - API calls cho Tranh
import apiClient from './api';
import { Artwork } from '../types';

// Interface cho response từ backend
interface TranhViewDTO {
  id: string;
  tenTranh: string;
  loaiTranhId: string;
  tenLoai: string;
  hoaSiId: string;
  tenHoaSi: string;
  moTa?: string;
  kichThuoc?: string;
  chatLieu?: string;
  giaBan: number;
  soLuongTon: number;
  hinhAnh?: string;
  ngayThem: string;
  trangThai: string;
}

// Chuyển đổi từ DTO backend sang Artwork frontend
const mapToArtwork = (dto: TranhViewDTO): Artwork => {
  return {
    id: dto.id,
    tenTranh: dto.tenTranh,
    giaBan: dto.giaBan,
    danhMuc: dto.tenLoai as 'Tranh sơn dầu' | 'Tranh sơn mài' | 'Tranh cổ điển',
    tacGia: dto.tenHoaSi,
    kichThuoc: dto.kichThuoc,
    chatLieu: dto.chatLieu,
    chatLieuKhung: '', // Backend không có field này
    soLuongTon: dto.soLuongTon,
    anhTranh: dto.hinhAnh || '/placeholder.jpg',
    moTa: dto.moTa,
    isFeatured: false, // Có thể thêm logic để xác định
    isBestSelling: false, // Có thể thêm logic để xác định
  };
};

export const artworkService = {
  // Lấy tất cả tranh
  async getAllArtworks(): Promise<Artwork[]> {
    try {
      const response = await apiClient.get<TranhViewDTO[]>('/Tranh/get-all');
      return response.data.map(mapToArtwork);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      throw error;
    }
  },

  // Lấy tranh theo ID
  async getArtworkById(id: string): Promise<Artwork> {
    try {
      const response = await apiClient.get<TranhViewDTO>(`/Tranh/get-by-id/${id}`);
      return mapToArtwork(response.data);
    } catch (error) {
      console.error('Error fetching artwork:', error);
      throw error;
    }
  },

  // Tạo tranh mới (Admin only)
  async createArtwork(data: any): Promise<string> {
    try {
      const response = await apiClient.post('/Tranh/create', data);
      return response.data.message;
    } catch (error: any) {
      console.error('Error creating artwork:', error);
      throw new Error(error.response?.data?.message || 'Lỗi khi tạo tranh');
    }
  },

  // Cập nhật tranh (Admin only)
  async updateArtwork(data: any): Promise<string> {
    try {
      const response = await apiClient.put('/Tranh/update', data);
      return response.data.message;
    } catch (error: any) {
      console.error('Error updating artwork:', error);
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật tranh');
    }
  },

  // Xóa tranh (Admin only)
  async deleteArtwork(id: string): Promise<string> {
    try {
      const response = await apiClient.delete(`/Tranh/delete/${id}`);
      return response.data.message;
    } catch (error: any) {
      console.error('Error deleting artwork:', error);
      throw new Error(error.response?.data?.message || 'Lỗi khi xóa tranh');
    }
  },
};
