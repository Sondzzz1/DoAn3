// Test Auth Page - Kiểm tra và reset tài khoản
import React, { useState, useEffect } from 'react';

const TestAuth: React.FC = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    const accountList = [];
    const emails = ['admin@art.com', 'user@art.com', 'artist@art.com', 'author@art.com'];
    
    for (const email of emails) {
      const key = `user_account_${email}`;
      const data = localStorage.getItem(key);
      if (data) {
        try {
          accountList.push({ email, data: JSON.parse(data), exists: true });
        } catch (e) {
          accountList.push({ email, data: null, exists: false, error: 'Invalid JSON' });
        }
      } else {
        accountList.push({ email, data: null, exists: false });
      }
    }
    
    setAccounts(accountList);
  };

  const resetData = () => {
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

    setMessage('✅ Đã reset và khởi tạo lại dữ liệu!');
    loadAccounts();
  };

  const clearAll = () => {
    if (window.confirm('Xóa toàn bộ localStorage?')) {
      localStorage.clear();
      setMessage('✅ Đã xóa toàn bộ localStorage!');
      loadAccounts();
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🔧 Test Authentication</h1>
      
      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={resetData}
          style={{
            padding: '12px 24px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          🔄 Reset & Khởi tạo lại
        </button>
        
        <button 
          onClick={clearAll}
          style={{
            padding: '12px 24px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          🗑️ Xóa toàn bộ
        </button>
        
        <button 
          onClick={loadAccounts}
          style={{
            padding: '12px 24px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          🔍 Reload
        </button>
      </div>

      {message && (
        <div style={{
          padding: '15px',
          background: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '5px',
          marginBottom: '20px',
          color: '#155724'
        }}>
          {message}
        </div>
      )}

      <h2>Danh Sách Tài Khoản</h2>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        {accounts.map((account, index) => (
          <div 
            key={index}
            style={{
              padding: '20px',
              background: account.exists ? '#d4edda' : '#f8d7da',
              border: `1px solid ${account.exists ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '8px'
            }}
          >
            <h3 style={{ margin: '0 0 10px 0' }}>
              {account.exists ? '✅' : '❌'} {account.email}
            </h3>
            
            {account.exists && account.data ? (
              <div style={{ fontSize: '0.9rem' }}>
                <p><strong>Tên:</strong> {account.data.name}</p>
                <p><strong>Role:</strong> {account.data.role}</p>
                <p><strong>Password:</strong> {account.data.password}</p>
                {account.data.phone && <p><strong>Phone:</strong> {account.data.phone}</p>}
                {account.data.specialization && <p><strong>Chuyên môn:</strong> {account.data.specialization}</p>}
              </div>
            ) : (
              <p style={{ color: '#721c24', margin: 0 }}>
                {account.error || 'Tài khoản không tồn tại'}
              </p>
            )}
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        background: '#fff3cd', 
        border: '1px solid #ffc107',
        borderRadius: '8px'
      }}>
        <h3>📋 Hướng dẫn sử dụng:</h3>
        <ol>
          <li>Click "Reset & Khởi tạo lại" để tạo lại tất cả tài khoản</li>
          <li>Kiểm tra danh sách tài khoản bên trên</li>
          <li>Thử đăng nhập với các tài khoản:
            <ul>
              <li>admin@art.com | 123456</li>
              <li>artist@art.com | 123456</li>
              <li>author@art.com | 123456</li>
              <li>user@art.com | 123456</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default TestAuth;
