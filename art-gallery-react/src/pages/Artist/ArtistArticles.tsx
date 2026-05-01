// Artist Articles - Quản lý bài viết của họa sĩ
import React, { useState, useEffect } from 'react';
import { artistDashboardService, BaiVietResponse } from '../../services/artistDashboardService';

const ArtistArticles: React.FC = () => {
  const [articles, setArticles] = useState<BaiVietResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BaiVietResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await artistDashboardService.getBaiVietCuaToi();
      setArticles(data);
    } catch (error) {
      console.error('Lỗi khi tải bài viết:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (article?: BaiVietResponse) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.tieuDe,
        content: article.noiDung || '',
      });
    } else {
      setEditingArticle(null);
      setFormData({
        title: '',
        content: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingArticle) {
        await artistDashboardService.capNhatBaiViet(editingArticle.maBaiViet, {
          tieuDe: formData.title,
          noiDung: formData.content
        });
        alert('Cập nhật bài viết thành công!');
      } else {
        await artistDashboardService.taoBaiViet({
          tieuDe: formData.title,
          noiDung: formData.content
        });
        alert('Tạo bài viết thành công!');
      }
      
      setIsModalOpen(false);
      loadArticles();
    } catch (error: any) {
       alert(error.message || 'Có lỗi xảy ra khi lưu bài viết');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        await artistDashboardService.xoaBaiViet(id);
        alert('Đã xóa bài viết!');
        loadArticles();
      } catch (error: any) {
        alert(error.message || 'Lỗi khi xóa bài viết');
      }
    }
  };

  let filteredArticles = articles;
  if (searchQuery.trim() !== '') {
    filteredArticles = filteredArticles.filter(a => a.tieuDe.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  if (loading) return <div className="page" style={{ padding: '20px' }}>Đang tải dữ liệu...</div>;

  return (
    <div id="content" className="page">
      <div className="page-header">
        <h4><i className="ti-write"></i> Quản Lý Bài Viết</h4>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <i className="ti-plus"></i> Viết bài mới
        </button>
      </div>

      <div className="filter-bar" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tiêu đề..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '5px', flex: 1 }}
        />
      </div>

      {filteredArticles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '10px' }}>
             <i className="ti-write" style={{ fontSize: '4rem', color: '#ddd' }}></i>
             <h3>Không có bài viết nào</h3>
          </div>
      ) : (
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Ngày đăng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article) => (
                <tr key={article.maBaiViet}>
                  <td><strong>{article.tieuDe}</strong></td>
                  <td>{new Date(article.ngayDang).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <button onClick={() => handleOpenModal(article)} title="Sửa">
                      <i className="ti-pencil"></i>
                    </button>
                    <button 
                      onClick={() => handleDelete(article.maBaiViet)}
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
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h3>{editingArticle ? 'Sửa Bài Viết' : 'Viết Bài Mới'}</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tiêu đề: <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nhập tiêu đề bài viết..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Nội dung: <span style={{ color: 'red' }}>*</span></label>
                <textarea
                  rows={10}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Viết nội dung bài viết..."
                  required
                ></textarea>
              </div>

              <div className="modal-buttons">
                <button type="submit" className="btn-save">
                  {editingArticle ? 'Cập nhật' : 'Đăng bài'}
                </button>
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={() => setIsModalOpen(false)}
                >
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

export default ArtistArticles;
