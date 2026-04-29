// Checkout Page - Thanh toán đơn hàng
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { orderService } from '../services/orderService';
import '../assets/css/Checkout.css';

const Checkout: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    note: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thanh toán!');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      navigate('/cart');
    }
  }, [isAuthenticated, cart, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      alert('Không tìm thấy thông tin người dùng!');
      return;
    }

    if (cart.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }

    setLoading(true);
    try {
      await orderService.createOrder(
        parseInt(user.id),
        {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        },
        cart
      );

      alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
      clearCart();
      navigate('/user/orders');
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (!isAuthenticated || cart.length === 0) {
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Thanh Toán</h1>

        <div className="checkout-content">
          {/* Thông tin giao hàng */}
          <div className="checkout-form">
            <h2>Thông Tin Giao Hàng</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Họ và Tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div className="form-group">
                <label>
                  Số Điện Thoại <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="form-group">
                <label>
                  Địa Chỉ Giao Hàng <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Nhập địa chỉ giao hàng"
                />
              </div>

              <div className="form-group">
                <label>Ghi Chú</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Ghi chú về đơn hàng (tùy chọn)"
                />
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đặt Hàng'}
              </button>
            </form>
          </div>

          {/* Đơn hàng */}
          <div className="order-summary">
            <h2>Đơn Hàng Của Bạn</h2>
            
            <div className="order-items">
              {cart.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>Số lượng: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-total">
              <div className="total-row">
                <span>Tạm tính:</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="total-row">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <div className="total-row final">
                <strong>Tổng cộng:</strong>
                <strong className="total-price">{formatPrice(cartTotal)}</strong>
              </div>
            </div>

            <div className="payment-info">
              <h3>Phương Thức Thanh Toán</h3>
              <p>
                <i className="ti-money"></i> Thanh toán khi nhận hàng (COD)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
