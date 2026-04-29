// Footer Component
import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Footer.css';

const Footer: React.FC = () => {
  return (
    <div id="footer">
      <div className="overlay">
        <img src="/assets/TrangNgoai/Trung-Bay-2-01.jpg" alt="Hình ảnh triển lãm" />
        <div className="overlay-content">
          <h2>Đăng ký email</h2>
          <p>Để nhận tin nhắn thông tin và khuyến mãi từ chúng tôi</p>
          <div className="email-form">
            <input type="email" placeholder="Your Email (required)" />
            <button>Sign Up</button>
          </div>
        </div>

        <div className="footer-container">
          <div className="footer-contact">
            <h3>LANVU GALLERY</h3>
            <p><i className="ti-location-pin"></i> 56 Nguyễn Phong Sắc, Dịch Vọng, Cầu Giấy, Hà Nội</p>
            <p><i className="ti-mobile"></i> 094 888 3535 - 094 886 3535</p>
            <p><i className="ti-email"></i> lanvugallery@gmail.com</p>
            <p><i className="ti-facebook"></i> <a href="#!">facebook.com/lanvugallery123</a></p>
          </div>

          <div className="footer-section">
            <h3>Hỗ trợ</h3>
            <ul>
              <li><Link to="/account">Tài khoản</Link></li>
              <li><Link to="/wishlist">Sản phẩm yêu thích</Link></li>
              <li><Link to="/cart">Giỏ hàng</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Hướng dẫn</h3>
            <ul>
              <li><Link to="/guide/payment">Mua hàng và thanh toán</Link></li>
              <li><Link to="/guide/return">Chính sách đổi trả & lưu kho</Link></li>
              <li><Link to="/guide/terms">Điều khoản dịch vụ</Link></li>
              <li><Link to="/guide/shipping">Chính sách giao hàng & vận chuyển</Link></li>
              <li><Link to="/guide/warranty">Chính sách bảo hành</Link></li>
            </ul>
          </div>

          <div className="footer-social">
            <h3>Fanpage</h3>
            <div className="fanpage-box">LanVu Gallery - 51,628 người theo dõi</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
