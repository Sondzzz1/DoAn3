// Home Page - Kết nối với API Backend
import React, { useState, useEffect } from 'react';
import ArtworkCard from '../components/ArtworkCard';
import { useArtworks } from '../hooks/useArtworks';
import { useAppContext } from '../context/AppContext';
import '../assets/css/Home.css';

const Home: React.FC = () => {
  const { featuredArtworks, bestSellingArtworks } = useArtworks();
  const { loading } = useAppContext();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    '/assets/TrangNgoai/anhgiaodien1.webp',
    '/assets/TrangNgoai/anhgiaodien2.webp',
    '/assets/TrangNgoai/anhgiaodien3.jpg',
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="home-page">
      <div id="slider">
        <div className="slider-container">
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide}
              alt={`Slide ${index + 1}`}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
            />
          ))}
          <button className="slider-btn prev" onClick={handlePrevSlide}>‹</button>
          <button className="slider-btn next" onClick={handleNextSlide}>›</button>
        </div>
      </div>

      <div className="slide-introduce">
        <div className="slide-box">
          <h2><span>01.</span>TRANH SƠN DẦU CAO CẤP</h2>
          <p>Tranh sáng tác độc bản - Sơn dầu nhập khẩu độ bền hành trăm năm</p>
        </div>
        <div className="slide-box">
          <h2><span>02.</span>SỰ KHÁC BIỆT</h2>
          <p>Sang trọng - Tinh tế - kiến tạo không gian hiện đại</p>
        </div>
        <div className="slide-box">
          <h2><span>03.</span>TƯ VẤN CHUYÊN NGHIỆP</h2>
          <p>Đội ngũ chuyên nghiệp hàng đầu trong lĩnh vực kiến trúc - hội họa</p>
        </div>
      </div>

      <div className="intro-container">
        <div className="intro-video">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/xNOLRP9067c"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
          ></iframe>
        </div>
        <div className="intro-content">
          <h2>GIỚI THIỆU</h2>
          <div className="intro-text">
            <h3>Nội dung độc đáo</h3>
            <p><i>Hơn 1000 tác phẩm Tranh Sơn Dầu Cao Cấp chỉ có tại Lanvu Gallery.</i></p>
          </div>
          <div className="intro-text">
            <h3>Chất lượng hoàn hảo</h3>
            <p><i>Tranh sơn dầu cao cấp sử dụng chất liệu toan vải Nga nhập khẩu.</i></p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu từ server...</p>
        </div>
      )}

      {!loading && featuredArtworks.length > 0 ? (
        <div className="artworks-section">
          <h2 className="section-title">TÁC PHẨM NỔI BẬT</h2>
          <div className="artworks-grid">
            {featuredArtworks.slice(0, 4).map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </div>
      ) : !loading && (
        <div className="no-artworks">
          <p>⚠️ Chưa có tranh. Vui lòng kiểm tra kết nối API backend tại https://localhost:7001</p>
        </div>
      )}

      {!loading && bestSellingArtworks.length > 0 && (
        <div className="artworks-section">
          <h2 className="section-title">TÁC PHẨM BÁN CHẠY</h2>
          <div className="artworks-grid">
            {bestSellingArtworks.slice(0, 4).map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </div>
      )}

      <div className="feedback">
        <h2>KHÁCH HÀNG NHẬN XÉT VỀ CHÚNG TÔI</h2>
        <div className="feedback-content">
          <p>⭐⭐⭐⭐⭐ Chất lượng tranh rất tốt, giao hàng nhanh!</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
