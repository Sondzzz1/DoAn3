import React from 'react';

const AdminHome: React.FC = () => {
    return (
        <div id="home" className="page">
            <div className="header"><h4><i className="ti-info-alt"></i> Tổng quan hệ thống</h4></div>
            <div className="dashboard">
                <div className="card bg-primary"><i className="ti-package"></i><p>Tranh</p><h3>126</h3></div>
                <div className="card bg-success"><i className="ti-shopping-cart-full"></i><p>Đơn hàng</p><h3>89</h3></div>
                <div className="card bg-warning"><i className="ti-user"></i><p>Khách hàng</p><h3>52</h3></div>
                <div className="card bg-danger"><i className="ti-bar-chart"></i><p>Lợi nhuận</p><h3>24 triệu</h3></div>
            </div>

            <div className="block">
                <h4><i className="ti-time"></i> Hoạt động gần đây</h4>
                <div className="activity">
                    <div><i className="ti-plus"></i> Thêm tranh “Mùa thu vàng” vào hệ thống</div>
                    <div><i className="ti-shopping-cart"></i> Đơn hàng #DH102 vừa được tạo</div>
                    <div><i className="ti-user"></i> Khách hàng “Nguyễn Văn A” vừa đăng ký tài khoản</div>
                    <div><i className="ti-pencil-alt"></i> Cập nhật giá cho tranh “Cánh đồng lúa”</div>
                </div>
            </div>

            <div className="block">
                <h4><i className="ti-bar-chart"></i> Thống kê nhanh</h4>
                <div className="stats">
                    <div className="stat"><p>Doanh thu hôm nay</p><h3>2.4 triệu</h3></div>
                    <div className="stat"><p>Đơn hàng hôm nay</p><h3>12</h3></div>
                    <div className="stat"><p>Khách hàng mới</p><h3>3</h3></div>
                </div>
            </div>

            <div className="block" id="ghichu">
                <h4><i className="ti-notepad"></i> Ghi chú quản trị</h4>
                <textarea placeholder="Nhập ghi chú hoặc công việc cần làm..."></textarea>
            </div>
        </div>
    );
};

export default AdminHome;
