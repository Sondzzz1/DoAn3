import React, { useState } from 'react';

const AdminAuthors: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div id="authors" className="page">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h4 style={{ color: '#2c7be5', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <i className="ti-id-badge"></i> Quản lý Tác giả
                </h4>
                <button className="add-btn" onClick={() => setIsModalOpen(true)} style={{ margin: 0 }}>
                    <i className="ti-plus"></i> Thêm tác giả
                </button>
            </div>

            <table className="styled-table" style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '10px', overflow: 'hidden' }}>
                <thead>
                    <tr>
                        <th style={{ background: '#2c7be5', color: 'white', padding: '10px' }}>Tên tác giả</th>
                        <th style={{ background: '#2c7be5', color: 'white', padding: '10px' }}>Số tác phẩm</th>
                        <th style={{ background: '#2c7be5', color: 'white', padding: '10px' }}>Đánh giá</th>
                        <th style={{ background: '#2c7be5', color: 'white', padding: '10px' }}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Lân Vũ</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>18</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>5 Sao</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                            <button style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '5px', background: 'transparent', cursor: 'pointer' }}><i className="ti-pencil"></i></button>
                            <button style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '5px', background: 'transparent', cursor: 'pointer', color: 'red', marginLeft: '5px' }}><i className="ti-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Trần Vinh</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>5</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>4 Sao</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                            <button style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '5px', background: 'transparent', cursor: 'pointer' }}><i className="ti-pencil"></i></button>
                            <button style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '5px', background: 'transparent', cursor: 'pointer', color: 'red', marginLeft: '5px' }}><i className="ti-trash"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal show" style={{ display: 'flex' }}>
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h3>Thêm Tác giả mới</h3>
                        <form>
                            <label>Tên họa sĩ/tác giả:</label>
                            <input type="text" placeholder="Nhập tên..." required style={{ width: '100%', padding: '10px', marginTop: '5px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ddd' }} />

                            <label>Tiểu sử sơ lược:</label>
                            <textarea rows={4} placeholder="Vài nét về tác giả..." style={{ width: '100%', padding: '10px', marginTop: '5px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ddd' }}></textarea>

                            <div className="modal-buttons" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: '#008000', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Lưu thông tin</button>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: '#f0f0f0', border: '1px solid #dc3545', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAuthors;
