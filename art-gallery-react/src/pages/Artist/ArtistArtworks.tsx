// Artist Artworks - Quản lý tác phẩm của họa sĩ
import React, { useState, useEffect } from 'react';
import { artistDashboardService, TacPhamHoaSiResponse } from '../../services/artistDashboardService';
import { categoryService } from '../../services/categoryService';

const ArtistArtworks: React.FC = () => {
  const [myArtworks, setMyArtworks] = useState<TacPhamHoaSiResponse[]>([]);
  const [categories, setCategories] = useState<{ maDanhMuc: number, tenDanhMuc: string }[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<TacPhamHoaSiResponse | null>(null);
  
  const [formData, setFormData] = useState({
    tenTacPham: '',
    gia: '',
    maDanhMuc: '',
    soLuong: '1',
    anhTranh: '',
    moTa: '',
    kichThuoc: '',
    chatLieu: '',
    chatLieuKhung: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [artworksRes, categoriesRes] = await Promise.all([
        artistDashboardService.getTacPhamCuaToi(),
        categoryService.getAllCategories()
      ]);
      setMyArtworks(artworksRes);
      setCategories(categoriesRes);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu tác phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (artwork?: TacPhamHoaSiResponse) => {
    if (artwork) {
      setEditingArtwork(artwork);
      // Tìm mã danh mục dựa trên tên
      const cat = categories.find(c => c.tenDanhMuc === artwork.tenDanhMuc);
      setFormData({
        tenTacPham: artwork.tenTacPham,
        gia: artwork.gia.toString(),
        maDanhMuc: cat ? cat.maDanhMuc.toString() : (categories.length > 0 ? categories[0].maDanhMuc.toString() : ''),
        soLuong: artwork.soLuong.toString(),
        anhTranh: artwork.hinhAnh || '',
        moTa: artwork.moTa || '',
        kichThuoc: artwork.kichThuoc || '',
        chatLieu: artwork.chatLieu || '',
        chatLieuKhung: artwork.chatLieuKhung || '',
      });
    } else {
      setEditingArtwork(null);
      setFormData({
        tenTacPham: '',
        gia: '',
        maDanhMuc: categories.length > 0 ? categories[0].maDanhMuc.toString() : '',
        soLuong: '1',
        anhTranh: '',
        moTa: '',
        kichThuoc: '',
        chatLieu: '',
        chatLieuKhung: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        tenTacPham: formData.tenTacPham,
        gia: parseFloat(formData.gia),
        maDanhMuc: formData.maDanhMuc ? parseInt(formData.maDanhMuc) : undefined,
        soLuong: parseInt(formData.soLuong),
        hinhAnh: formData.anhTranh,
        moTa: formData.moTa,
        kichThuoc: formData.kichThuoc,
        chatLieu: formData.chatLieu,
        chatLieuKhung: formData.chatLieuKhung,
      };

      if (editingArtwork) {
        await artistDashboardService.capNhatTacPham(editingArtwork.maTacPham, payload);
        alert('Cập nhật tác phẩm thành công!');
      } else {
        await artistDashboardService.taoTacPham(payload);
        alert('Thêm tác phẩm thành công!');
      }
      
      setIsModalOpen(false);
      loadData();
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa tác phẩm này?')) {
      try {
        await artistDashboardService.xoaTacPham(id);
        alert('Xóa tác phẩm thành công!');
        loadData();
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

  let filteredArtworks = myArtworks;
  
  if (filter !== 'all') {
    filteredArtworks = filteredArtworks.filter(art => art.tenDanhMuc === filter);
  }

  if (searchQuery.trim() !== '') {
      filteredArtworks = filteredArtworks.filter(art => 
          art.tenTacPham.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }

  if (loading) return <div className="page" style={{ padding: '20px' }}>Đang tải dữ liệu...</div>;

  return (
    <div id="art" className="page">
      <div className="art-header">
        <h4><i className="ti-image"></i> Quản Lý Tác Phẩm</h4>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <i className="ti-plus"></i> Thêm Tác Phẩm
        </button>
      </div>

      <div className="filter-bar" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tên..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '5px', flex: 1 }}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <option value="all">Tất cả danh mục ({myArtworks.length})</option>
          {categories.map(c => (
              <option key={c.maDanhMuc} value={c.tenDanhMuc}>{c.tenDanhMuc}</option>
          ))}
        </select>
      </div>

      {filteredArtworks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '10px' }}>
          <i className="ti-image" style={{ fontSize: '4rem', color: '#ddd' }}></i>
          <h3>Không tìm thấy tác phẩm nào</h3>
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
                <tr key={artwork.maTacPham}>
                  <td>
                    {artwork.hinhAnh ? (
                        <img 
                            src={artwork.hinhAnh} 
                            alt={artwork.tenTacPham}
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }}
                        />
                    ) : (
                        <div style={{ width: '80px', height: '80px', backgroundColor: '#f0f0f0', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Img</div>
                    )}
                  </td>
                  <td><strong>{artwork.tenTacPham}</strong></td>
                  <td>{artwork.tenDanhMuc}</td>
                  <td>{formatPrice(artwork.gia)}</td>
                  <td>{artwork.soLuong}</td>
                  <td>
                    <button onClick={() => handleOpenModal(artwork)} title="Sửa">
                      <i className="ti-pencil"></i>
                    </button>
                    <button 
                      onClick={() => handleDelete(artwork.maTacPham)}
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
                      value={formData.tenTacPham}
                      onChange={(e) => setFormData({ ...formData, tenTacPham: e.target.value })}
                      placeholder="Ví dụ: Sang Đông" 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Giá bán (VNĐ): <span style={{ color: 'red' }}>*</span></label>
                    <input 
                      type="number" 
                      value={formData.gia}
                      onChange={(e) => setFormData({ ...formData, gia: e.target.value })}
                      placeholder="4500000" 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Danh mục: <span style={{ color: 'red' }}>*</span></label>
                    <select 
                      value={formData.maDanhMuc}
                      onChange={(e) => setFormData({ ...formData, maDanhMuc: e.target.value })}
                      required
                    >
                      {categories.map(c => (
                          <option key={c.maDanhMuc} value={c.maDanhMuc}>{c.tenDanhMuc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-column">
                  <div className="form-group">
                    <label>Số lượng: <span style={{ color: 'red' }}>*</span></label>
                    <input 
                      type="number" 
                      value={formData.soLuong}
                      onChange={(e) => setFormData({ ...formData, soLuong: e.target.value })}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Link ảnh:</label>
                    <input 
                      type="text" 
                      value={formData.anhTranh}
                      onChange={(e) => setFormData({ ...formData, anhTranh: e.target.value })}
                      placeholder="URL hình ảnh" 
                    />
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

                  <div className="form-group">
                    <label>Chất liệu tranh:</label>
                    <input 
                      type="text" 
                      value={formData.chatLieu}
                      onChange={(e) => setFormData({ ...formData, chatLieu: e.target.value })}
                      placeholder="Ví dụ: Sơn dầu trên toan" 
                    />
                  </div>

                  <div className="form-group">
                    <label>Chất liệu khung:</label>
                    <input 
                      type="text" 
                      value={formData.chatLieuKhung}
                      onChange={(e) => setFormData({ ...formData, chatLieuKhung: e.target.value })}
                      placeholder="Ví dụ: Khung gỗ sồi" 
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
