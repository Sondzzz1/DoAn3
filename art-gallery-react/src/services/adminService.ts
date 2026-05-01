import apiClient from './api';

export const adminService = {
  // === CATEGORY (DANH MỤC) ===
  getCategories: async () => {
    const response = await apiClient.get('/admin/danh-muc/get-all');
    return response.data;
  },
  createCategory: async (data: { tenDanhMuc: string; moTa: string }) => {
    const response = await apiClient.post('/admin/danh-muc/create', data);
    return response.data;
  },
  updateCategory: async (id: number, data: { tenDanhMuc: string; moTa: string }) => {
    const response = await apiClient.put(`/admin/danh-muc/${id}/update`, data);
    return response.data;
  },
  deleteCategory: async (id: number) => {
    const response = await apiClient.delete(`/admin/danh-muc/${id}/delete`);
    return response.data;
  },

  // === CONTENT (NỘI DUNG & BÀI VIẾT) ===
  getSystemContents: async (loai?: string) => {
    const response = await apiClient.get(`/admin/noi-dung/get-all${loai ? `?loai=${loai}` : ''}`);
    return response.data;
  },
  createSystemContent: async (data: { tieuDe: string; moTa: string; loai: string }) => {
    const response = await apiClient.post('/admin/noi-dung/create', data);
    return response.data;
  },
  updateSystemContent: async (id: number, data: { tieuDe: string; moTa: string; loai: string }) => {
    const response = await apiClient.put(`/admin/noi-dung/${id}/update`, data);
    return response.data;
  },
  deleteSystemContent: async (id: number) => {
    const response = await apiClient.delete(`/admin/noi-dung/${id}/delete`);
    return response.data;
  },

  getArticles: async () => {
    const response = await apiClient.get('/admin/bai-viet/get-all');
    return response.data;
  },
  approveArticle: async (id: number, pheDuyet: boolean) => {
    const response = await apiClient.put(`/admin/bai-viet/${id}/duyet`, { pheDuyet });
    return response.data;
  },

  // === ARTWORKS (TÁC PHẨM) ===
  getArtworks: async (trangThai?: number) => {
    const response = await apiClient.get(`/admin/tac-pham/get-all${trangThai !== undefined ? `?trangThai=${trangThai}` : ''}`);
    return response.data;
  },
  approveArtwork: async (id: number, pheDuyet: boolean) => {
    const response = await apiClient.put(`/admin/tac-pham/${id}/duyet`, { pheDuyet });
    return response.data;
  },

  // === ORDERS (ĐƠN HÀNG) ===
  getOrders: async () => {
    const response = await apiClient.get('/admin/don-hang/get-all');
    return response.data;
  },
  updateOrderStatus: async (id: number, trangThai: number) => {
    const response = await apiClient.put(`/admin/don-hang/${id}/update/trang-thai`, { trangThai });
    return response.data;
  },
  
  // === DASHBOARD ===
  getDashboard: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  }
};
