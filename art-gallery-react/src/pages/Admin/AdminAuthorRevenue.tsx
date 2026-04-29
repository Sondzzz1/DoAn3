import React from 'react';

const AdminAuthorRevenue: React.FC = () => {
    return (
        <div id="revenue" className="page">
            <div className="header"><h4><i className="ti-money"></i> Thống kê Doanh thu cá nhân</h4></div>
            
            <div className="dashboard">
                <div className="card bg-success" style={{ background: '#27ae60' }}>
                    <i className="ti-wallet"></i>
                    <p>Tổng thu nhập</p>
                    <h3>12.500.000₫</h3>
                </div>
                <div className="card bg-primary" style={{ background: '#e67e22' }}>
                    <i className="ti-image"></i>
                    <p>Tác phẩm đã bán</p>
                    <h3>8</h3>
                </div>
                <div className="card bg-danger" style={{ background: '#e74c3c' }}>
                    <i className="ti-stats-up"></i>
                    <p>Lợi nhuận dự tính</p>
                    <h3>5.200.000₫</h3>
                </div>
            </div>

            <div className="block">
                <h4><i className="ti-calendar"></i> Lịch sử bán hàng</h4>
                <div className="table-container">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Ngày</th>
                                <th>Tên tác phẩm</th>
                                <th>Giá bán</th>
                                <th>Hoa hồng</th>
                                <th>Thực nhận</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>15/04/2026</td>
                                <td>Mùa thu vàng</td>
                                <td>4.500.000₫</td>
                                <td>15%</td>
                                <td>3.825.000₫</td>
                            </tr>
                            <tr>
                                <td>10/04/2026</td>
                                <td>Cánh đồng lúa</td>
                                <td>2.000.000₫</td>
                                <td>15%</td>
                                <td>1.700.000₫</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminAuthorRevenue;
