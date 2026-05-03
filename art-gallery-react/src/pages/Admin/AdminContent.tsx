import React, { useState, useEffect } from 'react';
import { adminService, BaiVietResponse } from '../../services/adminService';


const AdminContent: React.FC = () => {
  const [contents, setContents] = useState<BaiVietResponse[]>([]);
  const [filter, setFilter] = useState<number>(-1); // -1: all
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingContent, setViewingContent] = useState<BaiVietResponse | null>(null);

  useEffect(() => {
    loadContents();
  }, []);

  const loadContents = async () => {
    try {
      const data = await adminService.getArticles();
      setContents(data);
    } catch (error) {
      console.error('Lỗi khi tải bài viết:', error);
    }
  };

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

  const handleApprove = async (id: number) => {
    if (window.confirm('Duyệt nội dung này?')) {
      try {
        await adminService.approveArticle(id, true);
        alert('Đã duyệt nội dung!');
        loadContents();
      } catch (error) {
        console.error('Lỗi khi duyệt:', error);
      }
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Lý do từ chối:');
    if (reason) {
      try {
        await adminService.approveArticle(id, false);
        alert('Đã từ chối nội dung!');
        loadContents();
      } catch (error) {
        console.error('Lỗi khi từ chối:', error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Xóa nội dung này?')) {
      // try { await adminService.deleteArticle(id); loadContents(); } catch...
      alert('Chưa cấu hình xóa!');
    }
  };

  const handleView = (content: BaiVietResponse) => {
    setViewingContent(content);
  };

  const filteredContents = filter === -1 
    ? contents 
    : contents.filter(c => c.trangThai === filter);

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
          <select value={filter} onChange={(e) => setFilter(Number(e.target.value))}>
            <option value={-1}>Tất cả ({contents.length})</option>
            <option value={0}>Chờ duyệt ({contents.filter(c => c.trangThai === 0).length})</option>
            <option value={1}>Đã duyệt ({contents.filter(c => c.trangThai === 1).length})</option>
            <option value={2}>Từ chối ({contents.filter(c => c.trangThai === 2).length})</option>
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
              <tr key={content.maBaiViet}>
                <td>
                  <strong>{content.tieuDe}</strong>
                </td>
                <td>Bài viết</td>
                <td>{content.tenHoaSi}</td>
                <td>{new Date(content.ngayDang).toLocaleDateString('vi-VN')}</td>
                <td>
                  <span className={`status ${content.trangThai === 0 ? 'status-pending' : content.trangThai === 1 ? 'status-success' : 'status-canceled'}`}>
                    {content.trangThaiText || (content.trangThai === 0 ? 'Chờ duyệt' : content.trangThai === 1 ? 'Đã duyệt' : 'Từ chối')}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleView(content)} title="Xem">
                    <i className="ti-eye"></i>
                  </button>
                  {content.trangThai === 0 && (
                    <>
                      <button 
                        onClick={() => handleApprove(content.maBaiViet)}
                        style={{ color: 'green', marginLeft: '5px' }}
                        title="Duyệt"
                      >
                        <i className="ti-check"></i>
                      </button>
                      <button 
                        onClick={() => handleReject(content.maBaiViet)}
                        style={{ color: 'orange', marginLeft: '5px' }}
                        title="Từ chối"
                      >
                        <i className="ti-close"></i>
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleDelete(content.maBaiViet)}
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
            <h3>{viewingContent.tieuDe}</h3>
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Người đăng:</strong> {viewingContent.tenHoaSi}</p>
              <p><strong>Ngày đăng:</strong> {new Date(viewingContent.ngayDang).toLocaleDateString('vi-VN')}</p>
              <p><strong>Trạng thái:</strong> <span className={`status ${viewingContent.trangThai === 0 ? 'status-pending' : viewingContent.trangThai === 1 ? 'status-success' : 'status-canceled'}`}>{viewingContent.trangThaiText}</span></p>
            </div>
            <div style={{ 
              padding: '20px', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h4>Nội dung:</h4>
              <p>{viewingContent.noiDung}</p>
            </div>
            {viewingContent.trangThai === 0 && (
              <div className="modal-buttons">
                <button 
                  onClick={() => {
                    handleApprove(viewingContent.maBaiViet);
                    setViewingContent(null);
                  }}
                  style={{ background: '#28a745' }}
                >
                  <i className="ti-check"></i> Duyệt
                </button>
                <button 
                  onClick={() => {
                    handleReject(viewingContent.maBaiViet);
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
