// Artist Articles - Quản lý bài viết của họa sĩ
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  views?: number;
}

const ArtistArticles: React.FC = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tác phẩm',
    content: '',
  });

  useEffect(() => {
    loadArticles();
  }, [user]);

  const loadArticles = () => {
    const stored = localStorage.getItem(`artist_articles_${user?.email}`);
    if (stored) {
      setArticles(JSON.parse(stored));
    } else {
      // Mock data mẫu
      const mockArticles: Article[] = [
        {
          id: '1',
          title: 'Giới thiệu tác phẩm "Vàng Vọng Thinh Không"',
          category: 'Tác phẩm',
          content: 'Tác phẩm được lấy cảm hứng từ vẻ đẹp của thiên nhiên...',
          date: '2026-04-25',
          status: 'approved',
          views: 150,
        },
        {
          id: '2',
          title: 'Kỹ thuật vẽ tranh sơn dầu',
          category: 'Kiến thức',
          content: 'Tranh sơn dầu là một trong những loại hình nghệ thuật...',
          date: '2026-04-20',
          status: 'pending',
          views: 0,
        },
      ];
      setArticles(mockArticles);
      localStorage.setItem(`artist_articles_${user?.email}`, JSON.stringify(mockArticles));
    }
  };

  const saveArticles = (updatedArticles: Article[]) => {
    setArticles(updatedArticles);
    localStorage.setItem(`artist_articles_${user?.email}`, JSON.stringify(updatedArticles));
  };

  const handleOpenModal = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        category: article.category,
        content: article.content,
      });
    } else {
      setEditingArticle(null);
      setFormData({
        title: '',
        category: 'Tác phẩm',
        content: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingArticle) {
      const updated = articles.map(a =>
        a.id === editingArticle.id
          ? { ...a, ...formData, status: 'pending' as const }
          : a
      );
      saveArticles(updated);
      alert('Cập nhật bài viết thành công! Đang chờ duyệt.');
    } else {
      const newArticle: Article = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString().split('T')[0],
        status: 'draft',
        views: 0,
      };
      saveArticles([...articles, newArticle]);
      alert('Tạo bài viết thành công!');
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Xóa bài viết này?')) {
      saveArticles(articles.filter(a => a.id !== id));
      alert('Đã xóa bài viết!');
    }
  };

  const handlePublish = (id: string) => {
    if (window.confirm('Gửi bài viết này để duyệt?')) {
      const updated = articles.map(a =>
        a.id === id ? { ...a, status: 'pending' as const } : a
      );
      saveArticles(updated);
      alert('Đã gửi bài viết để admin duyệt!');
    }
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      draft: 'Bản nháp',
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối',
    };
    return map[status] || status;
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      draft: 'status-draft',
      pending: 'status-pending',
      approved: 'status-success',
      rejected: 'status-canceled',
    };
    return map[status] || '';
  };

  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(a => a.status === filter);

  return (
    <div id="content" className="page">
      <div className="page-header">
        <h4><i className="ti-write"></i> Quản Lý Bài Viết</h4>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <i className="ti-plus"></i> Viết bài mới
        </button>
      </div>

      <div className="filter-bar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tất cả ({articles.length})</option>
          <option value="draft">Bản nháp ({articles.filter(a => a.status === 'draft').length})</option>
          <option value="pending">Chờ duyệt ({articles.filter(a => a.status === 'pending').length})</option>
          <option value="approved">Đã duyệt ({articles.filter(a => a.status === 'approved').length})</option>
          <option value="rejected">Từ chối ({articles.filter(a => a.status === 'rejected').length})</option>
        </select>
      </div>

      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Chuyên mục</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Lượt xem</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map((article) => (
              <tr key={article.id}>
                <td><strong>{article.title}</strong></td>
                <td>{article.category}</td>
                <td>{new Date(article.date).toLocaleDateString('vi-VN')}</td>
                <td>
                  <span className={`status ${getStatusClass(article.status)}`}>
                    {getStatusText(article.status)}
                  </span>
                </td>
                <td>{article.views || 0}</td>
                <td>
                  <button onClick={() => handleOpenModal(article)} title="Sửa">
                    <i className="ti-pencil"></i>
                  </button>
                  {article.status === 'draft' && (
                    <button 
                      onClick={() => handlePublish(article.id)}
                      style={{ color: 'green', marginLeft: '5px' }}
                      title="Gửi duyệt"
                    >
                      <i className="ti-check"></i>
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(article.id)}
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
                <label>Chuyên mục: <span style={{ color: 'red' }}>*</span></label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option>Tác phẩm</option>
                  <option>Kiến thức</option>
                  <option>Sự kiện</option>
                  <option>Triển lãm</option>
                  <option>Kỹ thuật</option>
                </select>
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
                  {editingArticle ? 'Cập nhật' : 'Lưu bản nháp'}
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
