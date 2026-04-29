// Login Page - Xử lý Form trong React
import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Register.css'; // Sử dụng chung file css của trang đăng kí

const Login: React.FC = () => {
  // State cho form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Event Handler - Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error khi user nhập
    setErrors(prev => ({
      ...prev,
      [name]: '',
    }));
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors = {
      email: '',
      password: '',
    };
    let isValid = true;

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
      isValid = false;
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Email không đúng định dạng';
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Event Handler - Xử lý submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Ngăn chặn reload trang

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        alert('✅ Đăng nhập thành công!');
        // Điều hướng dựa trên role
        const userRole = sessionStorage.getItem('userRole');
        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'author') {
          navigate('/artist');
        } else {
          navigate('/');
        }
      } else {
        alert('❌ Email hoặc mật khẩu không đúng!');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('❌ Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="register-section">
      <div className="register-container">
        <h2>Đăng nhập tài khoản</h2>
        <p>Nếu bạn chưa có tài khoản, <Link to="/register">đăng ký TẠI ĐÂY!</Link></p>

        <form onSubmit={handleSubmit} className="register-form">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập địa chỉ email*"
            className={errors.email ? 'error' : ''}
            required
          />
          {errors.email && <span style={{color: 'red', fontSize: '13px', display: 'block', textAlign: 'left', marginBottom: '10px', marginTop: '-10px'}}>{errors.email}</span>}

          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mật khẩu*"
            className={errors.password ? 'error' : ''}
            required
          />
          {errors.password && <span style={{color: 'red', fontSize: '13px', display: 'block', textAlign: 'left', marginBottom: '10px', marginTop: '-10px'}}>{errors.password}</span>}

          <button 
            type="submit" 
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div style={{marginTop: '20px', fontSize: '14px', color: '#666', background: '#f8f9fa', padding: '15px', borderRadius: '8px'}}>
          <p style={{margin: '5px 0', fontWeight: 'bold', color: '#333'}}>📋 Tài khoản demo:</p>
          <p style={{margin: '5px 0'}}><strong>Admin:</strong> admin@art.com | 123456</p>
          <p style={{margin: '5px 0'}}><strong>Họa sĩ 1:</strong> artist@art.com | 123456 (Lân Vũ)</p>
          <p style={{margin: '5px 0'}}><strong>Họa sĩ 2:</strong> author@art.com | 123456 (Đoàn Hòa)</p>
          <p style={{margin: '5px 0'}}><strong>User:</strong> user@art.com | 123456</p>
        </div>
      </div>
    </section>
  );
};

export default Login;

