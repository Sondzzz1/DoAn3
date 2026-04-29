# Hướng Dẫn Reset Dữ Liệu

Nếu bạn gặp vấn đề đăng nhập hoặc muốn reset lại dữ liệu, làm theo các bước sau:

## Cách 1: Xóa localStorage qua Console

1. Mở trình duyệt (Chrome/Edge/Firefox)
2. Nhấn F12 để mở Developer Tools
3. Chọn tab "Console"
4. Chạy lệnh sau:

```javascript
localStorage.clear();
location.reload();
```

## Cách 2: Xóa thủ công

1. Mở Developer Tools (F12)
2. Chọn tab "Application" (Chrome) hoặc "Storage" (Firefox)
3. Chọn "Local Storage" > "http://localhost:3000"
4. Xóa key `admin_initialized` và `artworks_initialized`
5. Reload trang (F5)

## Cách 3: Chạy script trong Console

Chạy script này trong Console để reset và khởi tạo lại:

```javascript
// Xóa dữ liệu cũ
localStorage.removeItem('admin_initialized');
localStorage.removeItem('artworks_initialized');

// Khởi tạo lại tài khoản
localStorage.setItem('user_account_admin@art.com', JSON.stringify({
  email: 'admin@art.com',
  password: '123456',
  name: 'Admin',
  role: 'admin',
}));

localStorage.setItem('user_account_user@art.com', JSON.stringify({
  email: 'user@art.com',
  password: '123456',
  name: 'Người dùng',
  phone: '0123456789',
  address: 'Hà Nội',
  role: 'user',
}));

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

console.log('✅ Đã reset và khởi tạo lại dữ liệu!');
alert('✅ Đã reset dữ liệu! Vui lòng reload trang (F5)');
```

## Tài Khoản Sau Khi Reset

- **Admin**: admin@art.com | 123456
- **Họa sĩ 1**: artist@art.com | 123456 (Lân Vũ)
- **Họa sĩ 2**: author@art.com | 123456 (Đoàn Hòa)
- **User**: user@art.com | 123456

## Lưu Ý

- Sau khi reset, reload trang (F5) để áp dụng thay đổi
- Nếu vẫn không đăng nhập được, thử xóa toàn bộ localStorage bằng `localStorage.clear()`
