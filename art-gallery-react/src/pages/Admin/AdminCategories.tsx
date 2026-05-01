// Admin Categories - Quản lý danh mục tranh
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

interface Category {
  maDanhMuc: number;
  tenDanhMuc: string;
  moTa?: string;
}

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    tenDanhMuc: '',
    moTa: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      alert('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        tenDanhMuc: category.tenDanhMuc,
        moTa: category.moTa || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        tenDanhMuc: '',
        moTa: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      tenDanhMuc: '',
      moTa: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Update
        await adminService.updateCategory(editingCategory.maDanhMuc, {
          tenDanhMuc: formData.tenDanhMuc,
          moTa: formData.moTa,
        });
        alert('Cập nhật danh mục thành công!');
      } else {
        // Create
        await adminService.createCategory({
          tenDanhMuc: formData.tenDanhMuc,
          moTa: formData.moTa,
        });
        alert('Thêm danh mục thành công!');
      }
      handleCloseModal();
      loadCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      alert(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa danh mục "${name}"?\nLưu ý: Không thể xóa nếu đã có tranh thuộc danh mục này.`)) {
      try {
        await adminService.deleteCategory(id);
        alert('Xóa danh mục thành công!');
        loadCategories();
      } catch (error: any) {
        console.error('Error deleting category:', error);
        alert(error.message || 'Không thể xóa danh mục này');
      }
    }
  };

  return (
    <div id="categories" className="page">
      <div className="page-header">
        <h4><i className="ti-folder"></i> Quản lý Danh Mục</h4>
        <button className="btn-create" onClick={() => handleOpenModal()}>
          <i className="ti-plus"></i> Thêm Danh Mục
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : categories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Tên Danh Mục</th>
                <th>Mô Tả</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.maDanhMuc}>
                  <td><strong>{category.tenDanhMuc}</strong></td>
                  <td>{category.moTa || 'Chưa có mô tả'}</td>
                  <td>
                    <button 
                      onClick={() => handleOpenModal(category)}
                      title="Sửa"
                    >
                      <i className="ti-pencil"></i>
                    </button>
                    <button 
                      style={{ color: 'red', marginLeft: '5px' }}
                      onClick={() => handleDelete(category.maDanhMuc, category.tenDanhMuc)}
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
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h3>{editingCategory ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới'}</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên Danh Mục: <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="tenDanhMuc"
                  value={formData.tenDanhMuc}
                  onChange={handleChange}
                  placeholder="VD: Tranh sơn dầu"
                  required
                />
              </div>

              <div className="form-group">
                <label>Mô Tả:</label>
                <textarea
                  name="moTa"
                  value={formData.moTa}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Mô tả về danh mục tranh..."
                />
              </div>

              <div className="modal-buttons">
                <button type="submit" className="btn-save">
                  {editingCategory ? 'Cập Nhật' : 'Thêm Mới'}
                </button>
                <button type="button" className="cancel" onClick={handleCloseModal}>
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

export default AdminCategories;
