import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1 style={{ color: '#ff7b00', fontSize: '48px' }}>✅ React App Đang Chạy!</h1>
      <p style={{ fontSize: '24px', marginTop: '20px' }}>
        Nếu bạn thấy trang này, nghĩa là React đã hoạt động!
      </p>
      <div style={{ marginTop: '40px', padding: '30px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>Thông tin:</h2>
        <p>✅ React: Hoạt động</p>
        <p>✅ TypeScript: Hoạt động</p>
        <p>✅ Router: Hoạt động</p>
        <p>✅ Recoil: Hoạt động</p>
      </div>
    </div>
  );
};

export default TestPage;
