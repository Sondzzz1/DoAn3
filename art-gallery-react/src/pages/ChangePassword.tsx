import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './ChangePassword.css';

const ChangePassword: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu mới không khớp!');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find((u: any) => u.email === user?.email);

    if (!currentUser || currentUser.password !== formData.currentPassword) {
      setError('Mật khẩu hiện tại không đúng!');
      return;
    }

    // Update password
    const updatedUsers = users.map((u: any) =>
      u.email === user?.email ? { ...u, password: formData.newPassword } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    alert('Đổi mật khẩu thành công!');
    navigate('/account');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="change-password-page">
      <div className="change-password-container">
        <div className="change-password-card">
          <h2>Đổi Mật Khẩu</h2>
          
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Mật khẩu hiện tại <span className="required">*</span></label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu mới <span className="required">*</span></label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <div className="form-group">
              <label>Xác nhận mật khẩu mới <span className="required">*</span></label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate('/account')}>
                Hủy
              </button>
              <button type="submit" className="btn-save">
                Đổi mật khẩu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
