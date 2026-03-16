# Đồ án: Hệ thống quản lý & bán tranh trực tuyến

## 1. Lý do chọn đề tài
Trong thời đại số hóa, việc đưa các tác phẩm nghệ thuật lên nền tảng trực tuyến không chỉ giúp các họa sĩ tiếp cận với nhiều khách hàng hơn mà còn giúp người yêu nghệ thuật dễ dàng tìm kiếm, sở hữu những tác phẩm ưng ý. Tuy nhiên, việc quản lý tranh mang tính đặc thù cao (về tác giả, chất liệu, tính độc bản). Đồ án này tập trung giải quyết bài toán quản trị kho tranh, quy trình bán hàng và tối ưu hóa trải nghiệm người dùng trong lĩnh vực nghệ thuật.

## 2. Mục tiêu của hệ thống
### Đối với chủ cửa hàng
- Quản lý hiệu quả danh mục tranh (số lượng, tác giả, giá cả).
- Theo dõi đơn hàng và báo cáo doanh thu chính xác theo thời gian thực.

### Đối với khách hàng
- Cung cấp một không gian triển lãm ảo trực quan.
- Hỗ trợ tìm kiếm tranh theo phong cách, chất liệu và thực hiện giao dịch mua bán nhanh chóng, an toàn.

## 3. Các phân hệ chức năng chính
### A. Phân hệ Quản trị (Dành cho Admin/Nhân viên)
Dựa trên cấu trúc hệ thống đã thiết kế, phân hệ quản trị bao gồm:

- **Quản lý Danh mục Tranh**
  - Thêm mới tác phẩm, cập nhật thông tin chi tiết: Tên tranh, Họa sĩ, Kích thước, Chất liệu, Năm sáng tác, Giá bán.
  - Quản lý trạng thái tranh: Còn hàng, Đã bán, Đang triển lãm.

- **Quản lý Đơn hàng**
  - Tiếp nhận đơn hàng từ khách hàng.
  - Cập nhật trạng thái xử lý: Chờ xác nhận, Đang giao, Hoàn thành, Hủy đơn.

- **Quản lý Khách hàng**
  - Lưu trữ thông tin định danh khách hàng.
  - Theo dõi lịch sử mua hàng và các yêu cầu hỗ trợ.

- **Báo cáo & Thống kê**
  - Theo dõi biểu đồ doanh thu theo tháng/quý.
  - Thống kê các dòng tranh hoặc họa sĩ có số lượng tiêu thụ cao nhất để đưa ra chiến lược kinh doanh.

- **Thiết lập hệ thống**
  - Quản lý tài khoản nhân viên.
  - Phân quyền và cấu hình các thông tin cơ bản của cửa hàng.

### B. Phân hệ Khách hàng (Dành cho người mua)
- **Triển lãm trực tuyến**
  - Xem danh sách tranh với hình ảnh chất lượng cao.
  - Bộ lọc thông minh theo giá, phong cách (Trừu tượng, Hiện thực, Phong cảnh...) hoặc theo Họa sĩ.

- **Chi tiết tác phẩm**
  - Xem mô tả ý nghĩa tác phẩm, thông số kỹ thuật và thông tin về tác giả.

- **Giỏ hàng & Thanh toán**
  - Chọn tranh vào giỏ hàng.
  - Nhập thông tin giao nhận và thực hiện đặt hàng trực tuyến.

- **Quản lý cá nhân**
  - Theo dõi trạng thái đơn hàng đã đặt.
  - Quản lý danh sách tranh yêu thích (Wishlist).

## 4. Luồng nghiệp vụ mẫu (Workflow)
1. Họa sĩ gửi tranh mới đến cửa hàng.
2. Nhân viên chụp ảnh, nhập thông tin tranh, gắn thẻ (Tag) và đăng lên hệ thống.
3. Khách hàng lên website/app, lọc tranh theo “Phong cách hiện đại”, chọn được bức ưng ý và thanh toán.
4. Hệ thống gửi thông báo cho Nhân viên và giảm số lượng tồn kho.
5. Nhân viên đóng gói, cập nhật mã vận đơn.
6. Admin cuối tháng vào xem biểu đồ để biết tháng này cửa hàng lời hay lỗ.

