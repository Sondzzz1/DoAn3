// Order Service - API calls cho Đơn hàng
import apiClient from './api';
import { Order, CartItem } from '../types';

// Interface cho DTO backend
interface DonHangCreateDTO {
  maNguoiDung: number;
  tenNguoiNhan?: string;
  soDienThoai?: string;
  diaChiGiao?: string;
  chiTiet: {
    maTacPham: number;
    soLuong: number;
  }[];
}

interface DonHangViewDTO {
  maDonHang: number;
  maNguoiDung: number;
  tenNguoiDung?: string;
  ngayDat: string;
  tongTien: number;
  tenNguoiNhan?: string;
  soDienThoai?: string;
  diaChiGiao?: string;
  trangThai: number;
  chiTiet: {
    maChiTietDH: number;
    maTacPham: number;
    tenTacPham?: string;
    hinhAnh?: string;
    soLuong: number;
    donGia: number;
    thanhTien: number;
  }[];
}

// Map trạng thái
const mapTrangThai = (status: number): 'pending' | 'shipped' | 'success' | 'canceled' => {
  switch (status) {
    case 0: return 'pending';
    case 1: return 'shipped';
    case 2: return 'success';
    case 3: return 'canceled';
    default: return 'pending';
  }
};

export const orderService = {
  // Tạo đơn hàng mới
  async createOrder(
    userId: number,
    customerInfo: {
      name: string;
      phone: string;
      address: string;
    },
    cartItems: CartItem[]
  ): Promise<string> {
    try {
      const orderData: DonHangCreateDTO = {
        maNguoiDung: userId,
        tenNguoiNhan: customerInfo.name,
        soDienThoai: customerInfo.phone,
        diaChiGiao: customerInfo.address,
        chiTiet: cartItems.map(item => ({
          maTacPham: parseInt(item.id),
          soLuong: item.quantity,
        })),
      };

      const response = await apiClient.post('/DonHang/create', orderData);
      return response.data.message;
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw new Error(error.response?.data?.message || 'Lỗi khi tạo đơn hàng');
    }
  },

  // Lấy tất cả đơn hàng (Admin)
  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await apiClient.get<DonHangViewDTO[]>('/DonHang/get-all');
      return response.data.map(dto => ({
        id: dto.maDonHang.toString(),
        maHD: `DH${dto.maDonHang.toString().padStart(6, '0')}`,
        tenKH: dto.tenNguoiNhan || dto.tenNguoiDung || 'Khách hàng',
        email: '', // Backend không có field này
        phone: dto.soDienThoai || '',
        address: dto.diaChiGiao || '',
        ngayLap: dto.ngayDat,
        trangThai: mapTrangThai(dto.trangThai),
        tongTien: dto.tongTien,
        items: dto.chiTiet.map(ct => ({
          id: ct.maTacPham.toString(),
          name: ct.tenTacPham || '',
          price: ct.donGia,
          image: ct.hinhAnh || '',
          quantity: ct.soLuong,
        })),
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Lấy đơn hàng theo user ID
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    try {
      const response = await apiClient.get<DonHangViewDTO[]>(`/DonHang/get-by-user/${userId}`);
      return response.data.map(dto => ({
        id: dto.maDonHang.toString(),
        maHD: `DH${dto.maDonHang.toString().padStart(6, '0')}`,
        tenKH: dto.tenNguoiNhan || dto.tenNguoiDung || 'Khách hàng',
        email: '',
        phone: dto.soDienThoai || '',
        address: dto.diaChiGiao || '',
        ngayLap: dto.ngayDat,
        trangThai: mapTrangThai(dto.trangThai),
        tongTien: dto.tongTien,
        items: dto.chiTiet.map(ct => ({
          id: ct.maTacPham.toString(),
          name: ct.tenTacPham || '',
          price: ct.donGia,
          image: ct.hinhAnh || '',
          quantity: ct.soLuong,
        })),
      }));
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  // Cập nhật trạng thái đơn hàng (Admin)
  async updateOrderStatus(orderId: number, status: number): Promise<string> {
    try {
      const response = await apiClient.put('/DonHang/update-status', {
        maDonHang: orderId,
        trangThai: status,
      });
      return response.data.message;
    } catch (error: any) {
      console.error('Error updating order status:', error);
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    }
  },
};
