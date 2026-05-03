import React, { useState } from 'react';
import { adminService } from '../../services/adminService';

const AdminApiTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testAPI = async (apiName: string, apiCall: () => Promise<any>) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log(`Testing ${apiName}...`);
      const data = await apiCall();
      setResult(data);
      console.log(`${apiName} Success:`, data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
      setError(`${apiName} Error: ${errorMsg}`);
      console.error(`${apiName} Error:`, err);
    } finally {
      setLoading(false);
    }
  };

  const tests = [
    {
      name: 'Dashboard',
      call: () => adminService.getDashboard(),
    },
    {
      name: 'Thống kê tổng quan',
      call: () => adminService.getThongKeTongQuan(),
    },
    {
      name: 'Tất cả đơn hàng',
      call: () => adminService.getAllDonHang(),
    },
    {
      name: 'Tất cả khách hàng',
      call: () => adminService.getAllKhachHang(),
    },
    {
      name: 'Tất cả họa sĩ',
      call: () => adminService.getAllHoaSi(),
    },
    {
      name: 'Tất cả tác phẩm',
      call: () => adminService.getAllTacPham(),
    },
    {
      name: 'Tất cả bài viết',
      call: () => adminService.getAllBaiViet(),
    },
    {
      name: 'Tất cả danh mục',
      call: () => adminService.getAllDanhMuc(),
    },
    {
      name: 'Doanh thu theo tháng',
      call: () => adminService.getDoanhThuTheoThang(2026),
    },
    {
      name: 'Tác phẩm bán chạy',
      call: () => adminService.getTacPhamBanChay(10),
    },
    {
      name: 'Khách hàng tiềm năng',
      call: () => adminService.getKhachHangTiemNang(10),
    },
    {
      name: 'Thống kê trạng thái đơn hàng',
      call: () => adminService.getThongKeTrangThaiDonHang(),
    },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Admin API Test</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Test kết nối với Admin API Backend
      </p>

      <div style={{ marginBottom: '30px' }}>
        <h3>API Endpoint:</h3>
        <code style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          display: 'block',
          borderRadius: '4px',
          marginTop: '10px'
        }}>
          {process.env.REACT_APP_API_URL || 'https://localhost:7222/api'}
        </code>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {tests.map((test) => (
          <button
            key={test.name}
            onClick={() => testAPI(test.name, test.call)}
            disabled={loading}
            style={{
              padding: '15px',
              background: '#ff7b00',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {test.name}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ 
          padding: '20px', 
          background: '#e3f2fd', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <p style={{ margin: 0, color: '#1976d2' }}>⏳ Đang gọi API...</p>
        </div>
      )}

      {error && (
        <div style={{ 
          padding: '20px', 
          background: '#ffebee', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#c62828', marginTop: 0 }}>❌ Lỗi</h3>
          <pre style={{ 
            color: '#c62828', 
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {error}
          </pre>
        </div>
      )}

      {result && (
        <div style={{ 
          padding: '20px', 
          background: '#e8f5e9', 
          borderRadius: '8px'
        }}>
          <h3 style={{ color: '#2e7d32', marginTop: 0 }}>✅ Kết quả</h3>
          <pre style={{ 
            background: 'white',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '500px',
            fontSize: '12px',
            lineHeight: '1.5'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        background: '#fff3e0',
        borderRadius: '8px'
      }}>
        <h3 style={{ marginTop: 0 }}>📝 Hướng dẫn</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li>Đảm bảo Backend đang chạy tại <code>https://localhost:7222</code></li>
          <li>Đăng nhập với tài khoản admin trước khi test</li>
          <li>Kiểm tra Console (F12) để xem chi tiết request/response</li>
          <li>Nếu gặp lỗi CORS, cần cấu hình CORS trên Backend</li>
          <li>Nếu gặp lỗi 401, cần đăng nhập lại</li>
        </ol>
      </div>
    </div>
  );
};

export default AdminApiTest;
