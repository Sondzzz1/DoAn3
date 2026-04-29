// Artist Dashboard - Trang tổng quan cho họa sĩ
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAppContext } from '../../context/AppContext';

interface ArtistStats {
  totalArtworks: number;
  publishedArtworks: number;
  pendingArtworks: number;
  totalArticles: number;
  totalRevenue: number;
  totalSales: number;
}

const ArtistDashboard: React.FC = () => {
  const { user } = useAuth();
  const { artworks } = useAppContext();
  const [stats, setStats] = useState<ArtistStats>({
    totalArtworks: 0,
    publishedArtworks: 0,
    pendingArtworks: 0,
    totalArticles: 0,
    totalRevenue: 0,
    totalSales: 0,
  });

  useEffect(() => {
    // Lọc tác phẩm của họa sĩ hiện tại
    const myArtworks = artworks.filter(art => art.tacGia === user?.name);
    
    setStats({
      totalArtworks: myArtworks.length,
      publishedArtworks: myArtworks.length, // Tất cả đều published
      pendingArtworks: 0, // Chưa có logic pending
      totalArticles: 0, // Chưa có API articles
      totalRevenue: 0, // Chưa có API revenue
      totalSales: myArtworks.reduce((sum, art) => sum + (art.soLuongTon || 0), 0),
    });
  }, [artworks, user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div id="home" className="page">
      <div className="header">
        <h4><i className="ti-dashboard"></i> Dashboard - Chào mừng, {user?.name}!</h4>
      </div>

      <div className="dashboard">
        <div className="card bg-primary">
          <i className="ti-image" style={{ fontSize: '2.5rem' }}></i>
          <h3>{stats.totalArtworks}</h3>
          <p>Tổng Tác Phẩm</p>
        </div>

        <div className="card bg-success">
          <i className="ti-check" style={{ fontSize: '2.5rem' }}></i>
          <h3>{stats.publishedArtworks}</h3>
          <p>Đã Xuất Bản</p>
        </div>

        <div className="card bg-warning">
          <i className="ti-write" style={{ fontSize: '2.5rem' }}></i>
          <h3>{stats.totalArticles}</h3>
          <p>Bài Viết</p>
        </div>

        <div className="card bg-success">
          <i className="ti-money" style={{ fontSize: '2.5rem' }}></i>
          <h3>{formatCurrency(stats.totalRevenue)}</h3>
          <p>Doanh Thu</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div className="block">
          <h4><i className="ti-image"></i> Tác Phẩm Gần Đây</h4>
          <div className="table-container">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên tranh</th>
                  <th>Giá bán</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {artworks
                  .filter(art => art.tacGia === user?.name)
                  .slice(0, 5)
                  .map(artwork => (
                    <tr key={artwork.id}>
                      <td>
                        <img src={artwork.anhTranh} alt={artwork.tenTranh} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }} />
                      </td>
                      <td>{artwork.tenTranh}</td>
                      <td>{formatCurrency(artwork.giaBan)}</td>
                      <td><span className="status success">Đã xuất bản</span></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="block">
          <h4><i className="ti-bolt"></i> Thao Tác Nhanh</h4>
          <div className="activity">
            <div><a href="/artist/artworks" style={{ textDecoration: 'none', color: 'inherit' }}><i className="ti-plus"></i> Thêm Tác Phẩm</a></div>
            <div><a href="/artist/articles" style={{ textDecoration: 'none', color: 'inherit' }}><i className="ti-write"></i> Viết Bài Mới</a></div>
            <div><a href="/artist/revenue" style={{ textDecoration: 'none', color: 'inherit' }}><i className="ti-bar-chart"></i> Xem Doanh Thu</a></div>
            <div><a href="/artist/profile" style={{ textDecoration: 'none', color: 'inherit' }}><i className="ti-settings"></i> Cập Nhật Hồ Sơ</a></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDashboard;
