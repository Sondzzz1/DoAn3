import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Artwork } from '../../types';
import { artworkService } from '../../services/artworkService';

const AdminArt: React.FC = () => {
    const { artworks, loading, refreshArtworks } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
    const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
    const [formData, setFormData] = useState({
        tenTranh: '',
        giaBan: '',
        danhMuc: 'Tranh sơn dầu' as 'Tranh sơn dầu' | 'Tranh sơn mài' | 'Tranh cổ điển',
        tacGia: '',
        kichThuoc: '',
        chatLieu: '',
        chatLieuKhung: '',
        soLuongTon: '1',
        anhTranh: '',
        moTa: '',
    });
    const [submitting, setSubmitting] = useState(false);

    // Filter artworks khi category thay đổi
    useEffect(() => {
        if (categoryFilter === '') {
            setFilteredArtworks(artworks);
        } else {
            setFilteredArtworks(artworks.filter(art => art.danhMuc === categoryFilter));
        }
    }, [artworks, categoryFilter]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handleOpenModal = (artwork?: Artwork) => {
        if (artwork) {
            setEditingArtwork(artwork);
            setFormData({
                tenTranh: artwork.tenTranh,
                giaBan: artwork.giaBan.toString(),
                danhMuc: artwork.danhMuc,
                tacGia: artwork.tacGia,
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
                tacGia: '',
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

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingArtwork(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const artworkData = {
                tenTranh: formData.tenTranh,
                giaBan: parseFloat(formData.giaBan),
                danhMuc: formData.danhMuc,
                tacGia: formData.tacGia,
                kichThuoc: formData.kichThuoc,
                chatLieu: formData.chatLieu,
                chatLieuKhung: formData.chatLieuKhung,
                soLuongTon: parseInt(formData.soLuongTon),
                anhTranh: formData.anhTranh,
                moTa: formData.moTa,
            };

            if (editingArtwork) {
                const updateData = {
                    id: editingArtwork.id,
                    ...artworkData
                };
                await artworkService.updateArtwork(updateData);
                alert('Cập nhật tác phẩm thành công!');
            } else {
                await artworkService.createArtwork(artworkData);
                alert('Thêm tác phẩm thành công!');
            }
            
            handleCloseModal();
            refreshArtworks();
        } catch (error: any) {
            console.error('Error saving artwork:', error);
            alert(error.message || 'Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Bạn có chắc muốn xóa tác phẩm "${name}"?`)) {
            try {
                await artworkService.deleteArtwork(id);
                alert('Xóa tác phẩm thành công!');
                refreshArtworks();
            } catch (error: any) {
                console.error('Error deleting artwork:', error);
                alert(error.message || 'Không thể xóa tác phẩm này');
            }
        }
    };

    return (
        <div id="art" className="page">
            <div className="art-header">
                <h4><i className="ti-image"></i> Quản lý Tranh</h4>
                <button className="add-btn" onClick={() => handleOpenModal()}>
                    <i className="ti-plus"></i> Thêm tranh
                </button>
            </div>

            <div className="filter-bar">
                <div className="filter-item">
                    <label>Lọc theo chủ đề:</label>
                    <select 
                        id="categoryFilter" 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">Tất cả ({artworks.length})</option>
                        <option value="Tranh sơn dầu">Tranh sơn dầu</option>
                        <option value="Tranh sơn mài">Tranh sơn mài</option>
                        <option value="Tranh cổ điển">Tranh cổ điển</option>
                    </select>
                </div>
                <button 
                    className="btn-refresh" 
                    onClick={refreshArtworks}
                    style={{ marginLeft: '10px', padding: '8px 15px' }}
                >
                    <i className="ti-reload"></i> Làm mới
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Đang tải dữ liệu...</p>
                </div>
            ) : filteredArtworks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Chưa có tranh nào. Hãy thêm tranh mới!</p>
                </div>
            ) : (
                <table className="art-table">
                    <thead>
                        <tr>
                            <th>Ảnh</th>
                            <th>Tên tranh</th>
                            <th>Danh mục</th>
                            <th>Giá bán</th>
                            <th>Tác giả</th>
                            <th>Số lượng tồn</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredArtworks.map((artwork) => (
                            <tr key={artwork.id}>
                                <td>
                                    <img 
                                        src={artwork.anhTranh} 
                                        alt={artwork.tenTranh}
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=No+Image';
                                        }}
                                    />
                                </td>
                                <td>{artwork.tenTranh}</td>
                                <td>{artwork.danhMuc}</td>
                                <td>{formatPrice(artwork.giaBan)}</td>
                                <td>{artwork.tacGia}</td>
                                <td>{artwork.soLuongTon}</td>
                                <td>
                                    <button onClick={() => handleOpenModal(artwork)} title="Sửa">
                                        <i className="ti-pencil"></i>
                                    </button>
                                    <button 
                                        style={{ color: 'red', marginLeft: '5px' }}
                                        onClick={() => handleDelete(artwork.id, artwork.tenTranh)}
                                        title="Xóa"
                                    >
                                        <i className="ti-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {isModalOpen && (
                <div id="artModal" className="modal show" style={{ display: 'flex' }}>
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h3>{editingArtwork ? 'Sửa Tác Phẩm' : 'Thêm Tác Phẩm Mới'}</h3>

                        <form id="artForm" onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-column">
                                    <div className="form-group">
                                        <label>Tên tranh: <span style={{ color: 'red' }}>*</span></label>
                                        <input 
                                            type="text" 
                                            name="tenTranh"
                                            value={formData.tenTranh}
                                            onChange={handleChange}
                                            placeholder="Ví dụ: Sang Đông" 
                                            required 
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Giá bán (VNĐ): <span style={{ color: 'red' }}>*</span></label>
                                        <input 
                                            type="number" 
                                            name="giaBan"
                                            value={formData.giaBan}
                                            onChange={handleChange}
                                            placeholder="4500000" 
                                            required 
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Danh mục: <span style={{ color: 'red' }}>*</span></label>
                                        <select 
                                            name="danhMuc"
                                            value={formData.danhMuc}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="Tranh sơn dầu">Tranh sơn dầu</option>
                                            <option value="Tranh sơn mài">Tranh sơn mài</option>
                                            <option value="Tranh cổ điển">Tranh cổ điển</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Tác giả: <span style={{ color: 'red' }}>*</span></label>
                                        <input 
                                            type="text" 
                                            name="tacGia"
                                            value={formData.tacGia}
                                            onChange={handleChange}
                                            placeholder="Tên họa sĩ" 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="form-column">
                                    <div className="form-group">
                                        <label>Kích thước:</label>
                                        <input 
                                            type="text" 
                                            name="kichThuoc"
                                            value={formData.kichThuoc}
                                            onChange={handleChange}
                                            placeholder="Ví dụ: 60x80 cm" 
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Chất liệu tranh:</label>
                                        <input 
                                            type="text" 
                                            name="chatLieu"
                                            value={formData.chatLieu}
                                            onChange={handleChange}
                                            placeholder="Sơn dầu, toan vải Nga..." 
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Chất liệu khung:</label>
                                        <input 
                                            type="text" 
                                            name="chatLieuKhung"
                                            value={formData.chatLieuKhung}
                                            onChange={handleChange}
                                            placeholder="Khung gỗ sồi cao cấp..." 
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Số lượng tồn: <span style={{ color: 'red' }}>*</span></label>
                                        <input 
                                            type="number" 
                                            name="soLuongTon"
                                            value={formData.soLuongTon}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Link ảnh: <span style={{ color: 'red' }}>*</span></label>
                                        <input 
                                            type="text" 
                                            name="anhTranh"
                                            value={formData.anhTranh}
                                            onChange={handleChange}
                                            placeholder="URL hình ảnh" 
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Mô tả chi tiết / Câu chuyện tác phẩm:</label>
                                <textarea 
                                    name="moTa"
                                    value={formData.moTa}
                                    onChange={handleChange}
                                    rows={5} 
                                    placeholder="Viết mô tả chi tiết về bức tranh..."
                                ></textarea>
                            </div>

                            <div className="modal-buttons">
                                <button type="submit" className="btn-save" disabled={submitting}>
                                    {submitting ? 'Đang lưu...' : (editingArtwork ? 'CẬP NHẬT' : 'LƯU TÁC PHẨM')}
                                </button>
                                <button type="button" className="btn-cancel" onClick={handleCloseModal} disabled={submitting}>
                                    HỦY BỎ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminArt;
