// Header Component với Props và Event Handling
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import '../assets/css/Header.css';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Event Handler - Xử lý đăng xuất
  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
      navigate('/');
    }
  };

  // Event Handler - Toggle menu mobile
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div className="ontop">
        <span className="ontop1">CONTACT | Thứ 2-CN: 08H00 - 21H00 | 0948883535 - 0948863535</span>
      </div>
      <div id="main">
        <div id="header">
          <div className="logo">
            <Link to="/">
              <h1 style={{ color: '#ff7b00', margin: 0 }}>🎨 ART GALLERY</h1>
            </Link>
          </div>
          
          <div className="menu-toggle" onClick={toggleMenu}>
            ☰
          </div>

          <ul id="nav" className={menuOpen ? 'active' : ''}>
            <li>
              <Link to="/">TRANG CHỦ</Link>
            </li>
            <li>
              <Link to="/about">GIỚI THIỆU</Link>
            </li>
            <li>
              <Link to="/artworks">TÁC PHẨM</Link>
            </li>
            <li>
              <Link to="/news">TIN TỨC</Link>
            </li>
            <li>
              <Link to="/contact">LIÊN HỆ</Link>
            </li>

            <div className="header-icons">
              {isAuthenticated ? (
                <div className="user-menu">
                  <Link to="/account" className="user-link">
                    👤 {user?.name}
                  </Link>
                  {(user?.role === 'admin' || user?.role === 'author') && (
                    <Link to="/admin" className="admin-link" title={user?.role === 'author' ? 'Trang Tác giả' : 'Trang Quản trị'}>
                      ⚙️
                    </Link>
                  )}
                  <button onClick={handleLogout} className="logout-btn">
                    🚪 Đăng xuất
                  </button>
                </div>
              ) : (
                <Link to="/login" className="user-link">
                  👤 Đăng nhập
                </Link>
              )}

              <Link to="/cart" className="cart-link">
                <div className="cart">
                  🛒
                  {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </div>
              </Link>
            </div>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;
