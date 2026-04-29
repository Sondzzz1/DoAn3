import React from 'react';

const AdminSettings: React.FC = () => {
    return (
        <div id="settings" className="page">
            <h4><i className="ti-settings"></i> Cài đặt hệ thống</h4>

            <div className="block">
                <h4><i className="ti-info-alt"></i> Cấu hình chung</h4>
                <form id="generalSettingsForm">
                    <div className="form-group-setting">
                        <label htmlFor="shopName">Tên cửa hàng:</label>
                        <input type="text" id="shopName" defaultValue="Nghệ Thuật" />
                        <small>Tên này sẽ hiển thị trên thanh điều hướng và báo cáo.</small>
                    </div>

                    <div className="form-group-setting">
                        <label htmlFor="adminEmail">Email quản trị:</label>
                        <input type="email" id="adminEmail" defaultValue="admin@nghethuat.vn" />
                        <small>Email nhận các thông báo quan trọng của hệ thống.</small>
                    </div>

                    <div className="form-group-setting">
                        <label htmlFor="currencyUnit">Đơn vị tiền tệ:</label>
                        <select id="currencyUnit" defaultValue="VNĐ">
                            <option value="VNĐ">VNĐ (Việt Nam Đồng)</option>
                            <option value="USD">USD ($)</option>
                        </select>
                    </div>

                    <button type="button" className="add-btn save-settings-btn">
                        <i className="ti-save"></i> Lưu cài đặt chung
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminSettings;
