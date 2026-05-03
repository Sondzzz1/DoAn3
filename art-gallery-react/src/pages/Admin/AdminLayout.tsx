import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Admin.css';

const AdminLayout: React.FC = () => {
    const { logout, user, isAdmin, isAuthor } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Nếu người dùng là tác giả và vào nhầm URL '/admin', chuyển hướng họ đến '/artist'
    useEffect(() => {
        if (isAuthor && location.pathname.startsWith('/admin')) {
            navigate('/artist', { replace: true });
        }
        
        // Nếu người dùng chưa đăng nhập hoặc là user thường đang cố gắng vào admin (nên nằm trong hook hoặc route guard, nhưng ta thêm bảo hiểm ở đây)
        if (!user || user.role === 'user') {
            navigate('/login');
        }
    }, [isAuthor, location.pathname, navigate, user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-wrapper">
            <div className="sidebar">
                <h2><i className="ti-palette"></i> ART GALLERY</h2>
                <ul>
                    {isAdmin && (
                        <NavLink to="/admin" end>
                            <li className={location.pathname === '/admin' ? 'active' : ''}>
                                <i className="ti-home"></i> Trang chủ
                            </li>
                        </NavLink>
                    )}

                    {/* Chỉ Admin mới thấy Quản lý Đơn hàng và Khách hàng */}
                    {isAdmin && (
                        <>
                            <NavLink to="/admin/orders">
                                <li className={location.pathname === '/admin/orders' ? 'active' : ''}>
                                    <i className="ti-shopping-cart"></i> Đơn hàng
                                </li>
                            </NavLink>
                            <NavLink to="/admin/customers">
                                <li className={location.pathname === '/admin/customers' ? 'active' : ''}>
                                    <i className="ti-user"></i> Khách hàng
                                </li>
                            </NavLink>
                        </>
                    )}

                    <NavLink to="/admin/art">
                        <li className={location.pathname === '/admin/art' ? 'active' : ''}>
                            <i className="ti-image"></i> Tác phẩm
                        </li>
                    </NavLink>

                    <NavLink to="/admin/content">
                        <li className={location.pathname === '/admin/content' ? 'active' : ''}>
                            <i className="ti-write"></i> Nội dung
                        </li>
                    </NavLink>

                    {/* Tác giả thấy thêm mục Hồ sơ và Doanh thu riêng */}
                    {isAuthor && (
                        <>
                            <NavLink to="/admin/profile">
                                <li className={location.pathname === '/admin/profile' ? 'active' : ''}>
                                    <i className="ti-id-badge"></i> Hồ sơ cá nhân
                                </li>
                            </NavLink>
                            <NavLink to="/admin/revenue">
                                <li className={location.pathname === '/admin/revenue' ? 'active' : ''}>
                                    <i className="ti-money"></i> Doanh thu
                                </li>
                            </NavLink>
                        </>
                    )}

                    {isAdmin && (
                        <>
                            <NavLink to="/admin/authors">
                                <li className={location.pathname === '/admin/authors' ? 'active' : ''}>
                                    <i className="ti-user"></i> Quản lý Tác giả
                                </li>
                            </NavLink>
                            <NavLink to="/admin/report">
                                <li className={location.pathname === '/admin/report' ? 'active' : ''}>
                                    <i className="ti-bar-chart"></i> Báo cáo
                                </li>
                            </NavLink>
                        </>
                    )}

                    {isAdmin && (
                        <NavLink to="/admin/settings">
                            <li className={location.pathname === '/admin/settings' ? 'active' : ''}>
                                <i className="ti-settings"></i> Thiết lập
                            </li>
                        </NavLink>
                    )}
                    
                    <Link to="/">
                        <li className="sidebar-link">
                            <i className="ti-world"></i> Về Trang Chủ
                        </li>
                    </Link>
                    <li className="logout-btn" onClick={handleLogout}>
                        <i className="ti-power-off"></i> Đăng xuất
                    </li>
                </ul>
            </div>

            <div className="content">
                <div className="topbar">
                    <div className="left">
                        <i className="ti-menu"></i>
                        <input type="text" placeholder="Tìm kiếm..." className="search-box" />
                    </div>
                    <div className="right">
                        <i className="ti-bell"></i>
                        <i className="ti-user"></i> <span>{user?.name || 'User'}</span>
                    </div>
                </div>

                {/* Khu vực hiển thị component con */}
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
