// Artwork Detail Page - Chi tiết tác phẩm
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { artworkService } from '../services/artworkService';
import { Artwork } from '../types';
import '../assets/css/ArtworkDetail.css';

const ArtworkDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { artworks } = useAppContext();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadArtwork();
  }, [id]);

  const loadArtwork = async () => {
    if (!id) return;

    setLoading(true);
    try {
      // Try to get from context first
      const found = artworks.find(art => art.id === id);
      if (found) {
        setArtwork(found);
      } else {
        // Fetch from API
        const data = await artworkService.getArtworkById(id);
        setArtwork(data);
      }
    } catch (error) {
      console.error('Error loading artwork:', error);
      alert('Không thể tải thông tin tác phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      navigate('/login');
      return;
    }

    if (!artwork) return;

    addToCart({
      id: artwork.id,
      name: artwork.tenTranh,
      price: artwork.giaBan,
      image: artwork.anhTranh,
      quantity: quantity,
    });

    alert('Đã thêm vào giỏ hàng!');
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để mua hàng!');
      navigate('/login');
      return;
    }

    if (!artwork) return;

    addToCart({
      id: artwork.id,
      name: artwork.tenTranh,
      price: artwork.giaBan,
      image: artwork.anhTranh,
      quantity: quantity,
    });

    navigate('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="artwork-detail-page">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="artwork-detail-page">
        <div className="not-found">
          <h2>Không tìm thấy tác phẩm</h2>
          <button onClick={() => navigate('/artworks')}>Quay lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="artwork-detail-page">
      <div className="detail-container">
        <div className="detail-image">
          <img
            src={artwork.anhTranh}
            alt={artwork.tenTranh}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600?text=No+Image';
            }}
          />
        </div>

        <div className="detail-info">
          <h1>{artwork.tenTranh}</h1>
          <p className="category">{artwork.danhMuc}</p>
          <p className="author">Họa sĩ: {artwork.tacGia}</p>
          
          <div className="price-section">
            <span className="price">{formatPrice(artwork.giaBan)}</span>
          </div>

          <div className="info-grid">
            {artwork.kichThuoc && (
              <div className="info-item">
                <strong>Kích thước:</strong>
                <span>{artwork.kichThuoc}</span>
              </div>
            )}
            {artwork.chatLieu && (
              <div className="info-item">
                <strong>Chất liệu:</strong>
                <span>{artwork.chatLieu}</span>
              </div>
            )}
            {artwork.chatLieuKhung && (
              <div className="info-item">
                <strong>Khung tranh:</strong>
                <span>{artwork.chatLieuKhung}</span>
              </div>
            )}
            <div className="info-item">
              <strong>Tình trạng:</strong>
              <span className={artwork.soLuongTon > 0 ? 'in-stock' : 'out-of-stock'}>
                {artwork.soLuongTon > 0 ? `Còn hàng (${artwork.soLuongTon})` : 'Hết hàng'}
              </span>
            </div>
          </div>

          {artwork.soLuongTon > 0 && (
            <div className="quantity-section">
              <label>Số lượng:</label>
              <div className="quantity-control">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val > 0 && val <= artwork.soLuongTon) {
                      setQuantity(val);
                    }
                  }}
                  min="1"
                  max={artwork.soLuongTon}
                />
                <button
                  onClick={() => setQuantity(Math.min(artwork.soLuongTon, quantity + 1))}
                  disabled={quantity >= artwork.soLuongTon}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button
              className="btn-add-cart"
              onClick={handleAddToCart}
              disabled={artwork.soLuongTon === 0}
            >
              <i className="ti-shopping-cart"></i> Thêm vào giỏ hàng
            </button>
            <button
              className="btn-buy-now"
              onClick={handleBuyNow}
              disabled={artwork.soLuongTon === 0}
            >
              Mua ngay
            </button>
          </div>

          {artwork.moTa && (
            <div className="description">
              <h3>Mô tả tác phẩm</h3>
              <p>{artwork.moTa}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
