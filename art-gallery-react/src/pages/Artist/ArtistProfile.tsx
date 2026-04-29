// Artist Profile - Quản lý hồ sơ họa sĩ
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  specialization: string;
  website: string;
  facebook: string;
  instagram: string;
}

const ArtistProfile: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    specialization: '',
    website: '',
    facebook: '',
    instagram: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`user_account_${user.email}`);
      if (stored) {
        const userData = JSON.parse(stored);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          bio: userData.bio || '',
          specialization: userData.specialization || '',
          website: userData.website || '',
          facebook: userData.facebook || '',
          instagram: userData.instagram || '',
        });
      }
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updatedUser = {
        ...user,
        ...formData,
      };
      localStorage.setItem(`user_account_${user.email}`, JSON.stringify(updatedUser));
      setIsEditing(false);
      alert('Cập nhật hồ sơ thành công!');
    }
  };

  return (
    <div id="profile" className="page">
      <div className="page-header">
        <h4><i className="ti-user"></i> Hồ Sơ Cá Nhân</h4>
        <button 
          className={isEditing ? 'btn-cancel' : 'add-btn'}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Hủy' : 'Chỉnh Sửa'}
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '10px', padding: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid #eee' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginRight: '20px'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: '0 0 5px 0' }}>{formData.name}</h2>
            <p style={{ margin: '0', color: '#666' }}>
              <i className="ti-palette"></i> {formData.specialization || 'Họa sĩ'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Thông Tin Cơ Bản</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Họ Tên: <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email: <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  style={{ background: '#f5f5f5' }}
                />
              </div>
              <div className="form-group">
                <label>Số Điện Thoại:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="0123456789"
                />
              </div>
              <div className="form-group">
                <label>Địa Chỉ:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Hà Nội, Việt Nam"
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Chuyên Môn</h3>
            <div className="form-group">
              <label>Lĩnh vực chuyên môn:</label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="">Chọn lĩnh vực</option>
                <option value="Tranh sơn dầu">Tranh sơn dầu</option>
                <option value="Tranh sơn mài">Tranh sơn mài</option>
                <option value="Tranh cổ điển">Tranh cổ điển</option>
                <option value="Tranh đương đại">Tranh đương đại</option>
                <option value="Tranh trừu tượng">Tranh trừu tượng</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Tiểu Sử</h3>
            <div className="form-group">
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows={6}
                placeholder="Viết về bản thân, phong cách nghệ thuật, kinh nghiệm..."
              />
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Mạng Xã Hội</h3>
            <div className="form-grid">
              <div className="form-group">
                <label><i className="ti-world"></i> Website:</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label><i className="ti-facebook"></i> Facebook:</label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="form-group">
                <label><i className="ti-instagram"></i> Instagram:</label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="modal-buttons">
              <button type="submit" className="btn-save">
                <i className="ti-check"></i> Lưu Thay Đổi
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => setIsEditing(false)}
              >
                Hủy
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ArtistProfile;
