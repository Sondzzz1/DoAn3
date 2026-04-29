// Khởi tạo dữ liệu mẫu cho localStorage
import { Artwork } from '../types';

export const sampleArtworks: Artwork[] = [
  {
    id: '1',
    tenTranh: 'Sang Đông',
    giaBan: 4500000,
    danhMuc: 'Tranh sơn dầu',
    tacGia: 'Lân Vũ',
    kichThuoc: '60x80 cm',
    chatLieu: 'Sơn dầu trên toan vải Nga',
    chatLieuKhung: 'Khung gỗ sồi cao cấp',
    soLuongTon: 5,
    anhTranh: '/assets/sondau/sangdong.webp',
    moTa: 'Bức tranh thể hiện vẻ đẹp của mùa đông sang',
    isFeatured: true,
    isBestSelling: false,
  },
  {
    id: '2',
    tenTranh: 'Vàng Vọng Thinh Không',
    giaBan: 5200000,
    danhMuc: 'Tranh sơn dầu',
    tacGia: 'Lân Vũ',
    kichThuoc: '70x90 cm',
    chatLieu: 'Sơn dầu trên toan vải Nga',
    chatLieuKhung: 'Khung gỗ sồi cao cấp',
    soLuongTon: 3,
    anhTranh: '/assets/sondau/vangvongthinhkhong.webp',
    moTa: 'Tác phẩm nghệ thuật độc đáo',
    isFeatured: true,
    isBestSelling: true,
  },
  {
    id: '3',
    tenTranh: 'Phố Băng',
    giaBan: 3800000,
    danhMuc: 'Tranh sơn dầu',
    tacGia: 'Đoàn Hòa',
    kichThuoc: '50x70 cm',
    chatLieu: 'Sơn dầu trên toan vải',
    chatLieuKhung: 'Khung gỗ',
    soLuongTon: 8,
    anhTranh: '/assets/sondau/PhoBang.webp',
    moTa: 'Khung cảnh phố băng tuyệt đẹp',
    isFeatured: false,
    isBestSelling: true,
  },
  {
    id: '4',
    tenTranh: 'Hạ Giã Ngói',
    giaBan: 4200000,
    danhMuc: 'Tranh sơn dầu',
    tacGia: 'Lân Vũ',
    kichThuoc: '60x80 cm',
    chatLieu: 'Sơn dầu trên toan vải Nga',
    chatLieuKhung: 'Khung gỗ sồi',
    soLuongTon: 4,
    anhTranh: '/assets/sondau/HaGiangoi.webp',
    moTa: 'Bức tranh về mùa hạ',
    isFeatured: true,
    isBestSelling: false,
  },
  {
    id: '5',
    tenTranh: 'Cổ Điển C1.8',
    giaBan: 6500000,
    danhMuc: 'Tranh cổ điển',
    tacGia: 'Nghệ nhân truyền thống',
    kichThuoc: '80x100 cm',
    chatLieu: 'Sơn dầu cổ điển',
    chatLieuKhung: 'Khung gỗ mạ vàng',
    soLuongTon: 2,
    anhTranh: '/assets/codien/C1.8.webp',
    moTa: 'Tranh cổ điển phong cách Châu Âu',
    isFeatured: true,
    isBestSelling: true,
  },
];

// Hàm khởi tạo dữ liệu vào localStorage
export const initializeData = () => {
  // Kiểm tra nếu đã có dữ liệu thì không khởi tạo lại
  if (!localStorage.getItem('artworks_initialized')) {
    localStorage.setItem('admin_artworks', JSON.stringify(sampleArtworks));
    localStorage.setItem('artworks_initialized', 'true');
    console.log('✅ Đã khởi tạo dữ liệu mẫu');
  }

  // Khởi tạo tài khoản admin nếu chưa có
  if (!localStorage.getItem('admin_initialized')) {
    // Tài khoản Admin
    localStorage.setItem('user_account_admin@art.com', JSON.stringify({
      email: 'admin@art.com',
      password: '123456',
      name: 'Admin',
      role: 'admin',
    }));
    
    // Tài khoản User
    localStorage.setItem('user_account_user@art.com', JSON.stringify({
      email: 'user@art.com',
      password: '123456',
      name: 'Người dùng',
      phone: '0123456789',
      address: 'Hà Nội',
      role: 'user',
    }));
    
    // Tài khoản Họa sĩ 1 (artist@art.com)
    localStorage.setItem('user_account_artist@art.com', JSON.stringify({
      email: 'artist@art.com',
      password: '123456',
      name: 'Lân Vũ',
      phone: '0987654321',
      address: 'Hà Nội',
      role: 'author',
      bio: 'Họa sĩ chuyên về tranh sơn dầu',
      specialization: 'Tranh sơn dầu',
    }));
    
    // Tài khoản Họa sĩ 2 (author@art.com) - Tên khác để dễ phân biệt
    localStorage.setItem('user_account_author@art.com', JSON.stringify({
      email: 'author@art.com',
      password: '123456',
      name: 'Đoàn Hòa',
      phone: '0912345678',
      address: 'Hồ Chí Minh',
      role: 'author',
      bio: 'Họa sĩ chuyên về tranh sơn mài và tranh cổ điển',
      specialization: 'Tranh sơn mài',
    }));
    
    localStorage.setItem('admin_initialized', 'true');
    console.log('✅ Đã khởi tạo tài khoản mẫu (Admin, User, 2 Artists)');
  }
};
