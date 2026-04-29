// Admin Content - Quản lý và duyệt nội dung
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

interface Content {
  id: string;
  title: string;
  category: string;
  author: string;
  authorRole: 'admin' | 'author';
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  content: string;
}

const AdminContent: React.FC = () => {
  const { artworks } = useAppContext();
  const [contents, setContents] = useState<Content[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingContent, setViewingContent] = useState<Content | null>(null);

  useEffect(() => {
    // Mock data - Trong thực tế sẽ load từ API
    const mockContents: Content[] = [
      {
        id: '1',
        title: 'Giới thiệu tác phẩm "Vàng Vọng Thinh Không"',
        category: 'Tác phẩm',
        author: 'Họa Sĩ Lan Vũ',
        authorRole: 'author',
        date: '2026-04-25',
        status: 'pending',
        content: 'Tác phẩm được lấy cảm hứng từ...',
      },
      {
        id: '2',
        title: 'Nghệ thuật đương đại là gì?',
        category: 'Kiến thức',
        author: 'Admin',
        authorRole: 'admin',
        date: '2026-04-16',
        status: 'approved',
        content: 'Nghệ thuật đương đại...',
      },
    ];
    setContents(mockContents);
  }, []);

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối',
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string) => {
    const classMap: Record<string, string> = {
      pending: 'status-pending',
      approved: 'status-success',
      rejected: 'status-canceled',
    };
    return classMap[status] || '';
  };

  const handleApprove = (id: string) => {
    if (window.confirm('Duyệt nội dung này?')) {
      setContents(contents.map(c => 
        c.id === id ? { ...c, status: 'approved' as const } : c
      ));
      alert('Đã duyệt nội dung!');
    }
  };

  const handleReject = (id: string) => {
    const reason = prompt('Lý do từ chối:');
    if (reason) {
      setContents(contents.map(c => 
        c.id === id ? { ...c, status: 'rejected' as const } : c
      ));
      alert('Đã từ chối nội dung!');
      // TODO: Send notification to author
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Xóa nội dung này?')) {
      setContents(contents.filter(c => c.id !== id));
      alert('Đã xóa nội dung!');
    }
  };

  const handleView = (content: Content) => {
    setViewingContent(content);
  };

  const filteredContents = filter === 'all' 
    ? contents 
    : contents.filter(c => c.status === filter);

  return (
    <div id="content" className="page">
      <div className="page-header">
        <h4><i className="ti-write"></i> Quản lý Nội dung</h4>
        <button className="btn-create" onClick={() => setIsModalOpen(true)}>
          <i className="ti-plus"></i> Viết bài mới
        </button>
      </div>

      <div className="filter-bar">
        <div className="filter-item">
          <label>Trạng thái:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Tất cả ({contents.length})</option>
            <option value="pending">Chờ duyệt ({contents.filter(c => c.status === 'pending').length})</option>
            <option value="approved">Đã duyệt ({contents.filter(c => c.status === 'approved').length})</option>
            <option value="rejected">Từ chối ({contents.filter(c => c.status === 'rejected').length})</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Chuyên mục</th>
              <th>Người đăng</th>
              <th>Ngày đăng</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredContents.map((content) => (
              <tr key={content.id}>
                <td>
                  <strong>{content.title}</strong>
                  {content.authorRole === 'author' && (
                    <span style={{ 
                      marginLeft: '8px', 
                      padding: '2px 8px', 
                      background: '#667eea', 
                      color: 'white', 
                      borderRadius: '10px', 
                      fontSize: '0.75rem' 
                    }}>
                      Họa sĩ
                    </span>
                  )}
                </td>
                <td>{content.category}</td>
                <td>{content.author}</td>
                <td>{new Date(content.date).toLocaleDateString('vi-VN')}</td>
                <td>
                  <span className={`status ${getStatusClass(content.status)}`}>
                    {getStatusText(content.status)}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleView(content)} title="Xem">
                    <i className="ti-eye"></i>
                  </button>
                  {content.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleApprove(content.id)}
                        style={{ color: 'green', marginLeft: '5px' }}
                        title="Duyệt"
                      >
                        <i className="ti-check"></i>
                      </button>
                      <button 
                        onClick={() => handleReject(content.id)}
                        style={{ color: 'orange', marginLeft: '5px' }}
                        title="Từ chối"
                      >
                        <i className="ti-close"></i>
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleDelete(content.id)}
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

      {/* Modal xem nội dung */}
      {viewingContent && (
        <div className="modal show" style={{ display: 'flex' }}>
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <span className="close" onClick={() => setViewingContent(null)}>&times;</span>
            <h3>{viewingContent.title}</h3>
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Chuyên mục:</strong> {viewingContent.category}</p>
              <p><strong>Người đăng:</strong> {viewingContent.author}</p>
              <p><strong>Ngày đăng:</strong> {new Date(viewingContent.date).toLocaleDateString('vi-VN')}</p>
              <p><strong>Trạng thái:</strong> <span className={`status ${getStatusClass(viewingContent.status)}`}>{getStatusText(viewingContent.status)}</span></p>
            </div>
            <div style={{ 
              padding: '20px', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h4>Nội dung:</h4>
              <p>{viewingContent.content}</p>
            </div>
            {viewingContent.status === 'pending' && (
              <div className="modal-buttons">
                <button 
                  onClick={() => {
                    handleApprove(viewingContent.id);
                    setViewingContent(null);
                  }}
                  style={{ background: '#28a745' }}
                >
                  <i className="ti-check"></i> Duyệt
                </button>
                <button 
                  onClick={() => {
                    handleReject(viewingContent.id);
                    setViewingContent(null);
                  }}
                  style={{ background: '#ffc107', color: '#000' }}
                >
                  <i className="ti-close"></i> Từ chối
                </button>
                <button 
                  onClick={() => setViewingContent(null)}
                  className="cancel"
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal viết bài mới */}
      {isModalOpen && (
        <div className="modal show" style={{ display: 'flex' }}>
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h3>Đăng bài viết mới</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Đăng bài thành công!');
              setIsModalOpen(false);
            }}>
              <div className="form-group">
                <label>Tiêu đề bài viết:</label>
                <input type="text" placeholder="Nhập tiêu đề..." required />
              </div>

              <div className="form-group">
                <label>Chuyên mục:</label>
                <select>
                  <option>Sự kiện</option>
                  <option>Triển lãm</option>
                  <option>Kiến thức</option>
                  <option>Tác phẩm</option>
                </select>
              </div>

              <div className="form-group">
                <label>Nội dung:</label>
                <textarea rows={6} placeholder="Nội dung bài viết..."></textarea>
              </div>

              <div className="modal-buttons">
                <button type="submit">Đăng bài</button>
                <button type="button" className="cancel" onClick={() => setIsModalOpen(false)}>
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

export default AdminContent;
