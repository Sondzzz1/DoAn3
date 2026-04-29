// Artist Artworks - Quản lý tác phẩm của họa sĩ
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAppContext } from '../../context/AppContext';
import { Artwork } from '../../types';
import { artworkService } from '../../services/artworkService';

const ArtistArtworks: React.FC = () => {
  const { user } = useAuth();
  const { artworks, refreshArtworks } = useAppContext();
  const [myArtworks, setMyArtworks] = useState<Artwork[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [formData, setFormData] = useState({
    tenTranh: '',
    giaBan: '',
    danhMuc: 'Tranh sơn dầu' as 'Tranh sơn dầu' | 'Tranh sơn mài' | 'Tranh cổ điển',
    kichThuoc: '',
    chatLieu: '',
    chatLieuKhung: '',
    soLuongTon: '1',
    anhTranh: '',
    moTa: '',
  });

  useEffect(() => {
    const filtered = artworks.filter(art => art.tacGia === user?.name);
    setMyArtworks(filtered);
  }, [artworks, user]);

  const handleOpenModal = (artwork?: Artwork) => {
    if (artwork) {
      setEditingArtwork(artwork);
      setFormData({
        tenTranh: artwork.tenTranh,
        giaBan: artwork.giaBan.toString(),
        danhMuc: artwork.danhMuc,
        kichThuoc: artwork.kichThuoc || '',
        chatLieu: artwork.chatLieu || '',
        chatLieuKhung: artwork.chatLieuKhung || '',
        soLuongTon: artwork.soLuongTon.toString(),
        anhTranh: artwork.anhTranh,
        moTa: artwork.moTa || '',
      });
    } else {
      setEditingArtwork(null);
      setFormData({
        tenTranh: '',
        giaBan: '',
        danhMuc: 'Tranh sơn dầu',
        kichThuoc: '',
        chatLieu: '',
        chatLieuKhung: '',
        soLuongTon: '1',
        anhTranh: '',
        moTa: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const artworkData = {
        tenTranh: formData.tenTranh,
        giaBan: parseFloat(formData.giaBan),
        danhMuc: formData.danhMuc,
        tacGia: user?.name || '',
        kichThuoc: formData.kichThuoc,
        chatLieu: formData.chatLieu,
        chatLieuKhung: formData.chatLieuKhung,
        soLuongTon: parseInt(formData.soLuongTon),
        anhTranh: formData.anhTranh,
        moTa: formData.moTa,
      };

      if (editingArtwork) {
        await artworkService.updateArtwork({ id: editingArtwork.id, ...artworkData });
        alert('Cập nhật tác phẩm thành công!');
      } else {
        await artworkService.createArtwork(artworkData);
        alert('Thêm tác phẩm thành công!');
      }
      
      setIsModalOpen(false);
      refreshArtworks();
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa tác phẩm này?')) {
      try {
        await artworkService.deleteArtwork(id);
        alert('Xóa tác phẩm thành công!');
        refreshArtworks();
      } catch (error: any) {
        alert(error.message || 'Không thể xóa tác phẩm');
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const filteredArtworks = filter === 'all' 
    ? myArtworks 
    : myArtworks.filter(art => art.danhMuc === filter);

  return (
    <div id="art" className="page">
      <div className="art-header">
        <h4><i className="ti-image"></i> Quản Lý Tác Phẩm</h4>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <i className="ti-plus"></i> Thêm Tác Phẩm
        </button>
      </div>

      <div className="filter-bar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tất cả ({myArtworks.length})</option>
          <option value="Tranh sơn dầu">Tranh sơn dầu</option>
          <option value="Tranh sơn mài">Tranh sơn mài</option>
          <option value="Tranh cổ điển">Tranh cổ điển</option>
        </select>
      </div>

      {filteredArtworks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '10px' }}>
          <i className="ti-image" style={{ fontSize: '4rem', color: '#ddd' }}></i>
          <h3>Chưa có tác phẩm nào</h3>
          <p>Hãy thêm tác phẩm đầu tiên của bạn!</p>
          <button className="add-btn" onClick={() => handleOpenModal()}>
            <i className="ti-plus"></i> Thêm Tác Phẩm
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="art-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên tranh</th>
                <th>Danh mục</th>
                <th>Giá bán</th>
                <th>Số lượng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredArtworks.map(artwork => (
                <tr key={artwork.id}>
                  <td>
                    <img 
                      src={artwork.anhTranh} 
                      alt={artwork.tenTranh}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }}
                    />
                  </td>
                  <td><strong>{artwork.tenTranh}</strong></td>
                  <td>{artwork.danhMuc}</td>
                  <td>{formatPrice(artwork.giaBan)}</td>
                  <td>{artwork.soLuongTon}</td>
                  <td>
                    <button onClick={() => handleOpenModal(artwork)} title="Sửa">
                      <i className="ti-pencil"></i>
                    </button>
                    <button 
                      onClick={() => handleDelete(artwork.id)}
                      style={{ color: 'red', marginLeft: '5px' }}
                      title="Xóa"
                    >
                      <i className="ti-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal show" style={{ display: 'flex' }}>
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h3>{editingArtwork ? 'Sửa Tác Phẩm' : 'Thêm Tác Phẩm Mới'}</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-column">
                  <div className="form-group">
                    <label>Tên tranh: <span style={{ color: 'red' }}>*</span></label>
                    <input 
                      type="text" 
                      value={formData.tenTranh}
                      onChange={(e) => setFormData({ ...formData, tenTranh: e.target.value })}
                      placeholder="Ví dụ: Sang Đông" 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Giá bán (VNĐ): <span style={{ color: 'red' }}>*</span></label>
                    <input 
                      type="number" 
                      value={formData.giaBan}
                      onChange={(e) => setFormData({ ...formData, giaBan: e.target.value })}
                      placeholder="4500000" 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Danh mục: <span style={{ color: 'red' }}>*</span></label>
                    <select 
                      value={formData.danhMuc}
                      onChange={(e) => setFormData({ ...formData, danhMuc: e.target.value as any })}
                      required
                    >
                      <option value="Tranh sơn dầu">Tranh sơn dầu</option>
                      <option value="Tranh sơn mài">Tranh sơn mài</option>
                      <option value="Tranh cổ điển">Tranh cổ điển</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Kích thước:</label>
                    <input 
                      type="text" 
                      value={formData.kichThuoc}
                      onChange={(e) => setFormData({ ...formData, kichThuoc: e.target.value })}
                      placeholder="Ví dụ: 60x80 cm" 
                    />
                  </div>
                </div>

                <div className="form-column">
                  <div className="form-group">
                    <label>Chất liệu tranh:</label>
                    <input 
                      type="text" 
                      value={formData.chatLieu}
                      onChange={(e) => setFormData({ ...formData, chatLieu: e.target.value })}
                      placeholder="Sơn dầu, toan vải..." 
                    />
                  </div>

                  <div className="form-group">
                    <label>Chất liệu khung:</label>
                    <input 
                      type="text" 
                      value={formData.chatLieuKhung}
                      onChange={(e) => setFormData({ ...formData, chatLieuKhung: e.target.value })}
                      placeholder="Khung gỗ sồi..." 
                    />
                  </div>

                  <div className="form-group">
                    <label>Số lượng: <span style={{ color: 'red' }}>*</span></label>
                    <input 
                      type="number" 
                      value={formData.soLuongTon}
                      onChange={(e) => setFormData({ ...formData, soLuongTon: e.target.value })}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Link ảnh: <span style={{ color: 'red' }}>*</span></label>
                    <input 
                      type="text" 
                      value={formData.anhTranh}
                      onChange={(e) => setFormData({ ...formData, anhTranh: e.target.value })}
                      placeholder="URL hình ảnh" 
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Mô tả:</label>
                <textarea 
                  value={formData.moTa}
                  onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                  rows={5} 
                  placeholder="Mô tả về tác phẩm..."
                ></textarea>
              </div>

              <div className="modal-buttons">
                <button type="submit" className="btn-save">
                  {editingArtwork ? 'Cập nhật' : 'Thêm mới'}
                </button>
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistArtworks;
