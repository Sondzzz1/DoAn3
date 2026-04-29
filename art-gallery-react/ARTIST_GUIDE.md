# Hướng Dẫn Sử Dụng Tài Khoản Họa Sĩ

## Thông Tin Đăng Nhập

Có 2 tài khoản họa sĩ mẫu đã được tạo sẵn:

### Họa Sĩ 1 - Lân Vũ
- **Email**: artist@art.com
- **Mật khẩu**: 123456
- **Chuyên môn**: Tranh sơn dầu

### Họa Sĩ 2 - Đoàn Hòa
- **Email**: author@art.com
- **Mật khẩu**: 123456
- **Chuyên môn**: Tranh sơn mài

## Lưu Ý Quan Trọng

⚠️ **Nếu không đăng nhập được**, làm theo các bước sau:

1. Mở Developer Tools (F12)
2. Chọn tab "Console"
3. Chạy lệnh: `localStorage.clear(); location.reload();`
4. Hoặc xem file `RESET_DATA.md` để biết cách reset chi tiết

## Cách Chạy Ứng Dụng

```bash
cd art-gallery-react
npm start
```

**Lưu ý**: Dùng `npm start` chứ KHÔNG phải `npm run dev`

## Các Chức Năng Quản Lý

### 1. Dashboard (Trang Tổng Quan)
- Xem thống kê tổng quan về tác phẩm, bài viết, doanh thu
- Hiển thị các tác phẩm gần đây
- Các thao tác nhanh

### 2. Quản Lý Hồ Sơ
**Đường dẫn**: `/artist/profile`

**Chức năng**:
- Cập nhật thông tin cá nhân (tên, số điện thoại, địa chỉ)
- Chọn lĩnh vực chuyên môn
- Viết tiểu sử nghệ thuật
- Thêm liên kết mạng xã hội (Website, Facebook, Instagram)

**Cách sử dụng**:
1. Click nút "Chỉnh Sửa"
2. Cập nhật thông tin
3. Click "Lưu Thay Đổi"

### 3. Quản Lý Tác Phẩm
**Đường dẫn**: `/artist/artworks`

**Chức năng**:
- Xem danh sách tác phẩm của mình
- Thêm tác phẩm mới
- Sửa thông tin tác phẩm
- Xóa tác phẩm
- Lọc theo danh mục

**Thông tin tác phẩm**:
- Tên tranh (*)
- Giá bán (*)
- Danh mục: Tranh sơn dầu / Tranh sơn mài / Tranh cổ điển
- Kích thước
- Chất liệu tranh
- Chất liệu khung
- Số lượng tồn (*)
- Link ảnh (*)
- Mô tả

### 4. Quản Lý Bài Viết
**Đường dẫn**: `/artist/articles`

**Chức năng**:
- Viết bài viết mới
- Sửa bài viết
- Xóa bài viết
- Gửi bài viết để admin duyệt
- Xem trạng thái bài viết

**Trạng thái bài viết**:
- **Bản nháp**: Bài viết chưa gửi duyệt
- **Chờ duyệt**: Đã gửi, đang chờ admin duyệt
- **Đã duyệt**: Admin đã duyệt, bài viết được hiển thị
- **Từ chối**: Admin từ chối bài viết

**Chuyên mục**:
- Tác phẩm
- Kiến thức
- Sự kiện
- Triển lãm
- Kỹ thuật

### 5. Quản Lý Doanh Thu
**Đường dẫn**: `/artist/revenue`

**Chức năng**:
- Xem tổng doanh thu
- Xem hoa hồng (10% mỗi giao dịch)
- Xem doanh thu ròng
- Xem doanh thu theo tháng
- Xem chi tiết giao dịch

**Lưu ý**:
- Hoa hồng 10% được trừ từ mỗi giao dịch
- Doanh thu ròng = Doanh thu - Hoa hồng
- Thanh toán vào cuối mỗi tháng

## Cách Đăng Nhập

1. Truy cập trang chủ
2. Click "Đăng Nhập"
3. Nhập email: `artist@art.com`
4. Nhập mật khẩu: `123456`
5. Click "Đăng Nhập"
6. Hệ thống sẽ tự động chuyển đến trang Dashboard của họa sĩ

## Giao Diện

Giao diện họa sĩ được thiết kế tương tự admin với:
- Sidebar màu tím gradient
- Menu điều hướng rõ ràng
- Các biểu tượng trực quan
- Responsive trên mọi thiết bị

## Phân Quyền

Tài khoản họa sĩ chỉ có thể:
- Quản lý tác phẩm của chính mình
- Viết và quản lý bài viết của mình
- Xem doanh thu từ tác phẩm của mình
- Cập nhật hồ sơ cá nhân

Không thể:
- Xem/sửa tác phẩm của họa sĩ khác
- Duyệt bài viết (chỉ admin mới duyệt được)
- Quản lý đơn hàng
- Quản lý khách hàng

## Lưu Trữ Dữ Liệu

Dữ liệu được lưu trong localStorage:
- Thông tin tài khoản: `user_account_{email}`
- Bài viết: `artist_articles_{email}`
- Tác phẩm: `admin_artworks` (chung với admin)

## Hỗ Trợ

Nếu cần hỗ trợ, vui lòng liên hệ admin hoặc kiểm tra console để debug.
