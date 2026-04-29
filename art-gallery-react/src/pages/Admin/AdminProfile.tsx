import React from 'react';

const AdminProfile: React.FC = () => {
    return (
        <div id="profile" className="page">
            <div className="header"><h4><i className="ti-id-badge"></i> Hồ sơ Tác giả</h4></div>
            
            <div className="block" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                <div style={{ textAlign: 'center' }}>
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                         alt="Avatar" 
                         style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #2c7be5' }} />
                    <button className="add-btn" style={{ marginTop: '15px', width: '100%' }}>Đổi ảnh đại diện</button>
                </div>
                
                <div style={{ flex: 1 }}>
                    <form className="form-grid">
                        <div className="form-group">
                            <label>Họ và tên:</label>
                            <input type="text" defaultValue="Lan Vũ" />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input type="email" defaultValue="author@art.com" disabled />
                        </div>
                        <div className="form-group">
                            <label>Số điện thoại:</label>
                            <input type="text" defaultValue="0948883535" />
                        </div>
                        <div className="form-group">
                            <label>Lĩnh vực nghệ thuật:</label>
                            <input type="text" defaultValue="Tranh Sơn Dầu, Cổ Điển" />
                        </div>
                        <div className="form-group full-width" style={{ gridColumn: '1 / -1' }}>
                            <label>Tiểu sử / Giới thiệu:</label>
                            <textarea rows={5} defaultValue="Họa sĩ, kiến trúc sư Lan Vũ với hơn 20 năm kinh nghiệm trong ngành hội họa đương đại..."></textarea>
                        </div>
                    </form>
                    <button className="add-btn" style={{ marginTop: '20px' }}>Lưu thay đổi</button>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
