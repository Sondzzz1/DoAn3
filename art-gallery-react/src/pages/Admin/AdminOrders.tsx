import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await orderService.getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders:', error);
            alert('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId: string, newStatus: number) => {
        try {
            await orderService.updateOrderStatus(parseInt(orderId), newStatus);
            alert('Cập nhật trạng thái thành công!');
            loadOrders();
        } catch (error: any) {
            console.error('Error updating status:', error);
            alert(error.message || 'Không thể cập nhật trạng thái');
        }
    };

    const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            pending: 'Chờ xử lý',
            shipped: 'Đang giao',
            success: 'Hoàn thành',
            canceled: 'Đã hủy',
        };
        return statusMap[status] || status;
    };

    const getStatusNumber = (status: string): number => {
        const statusMap: Record<string, number> = {
            pending: 0,
            shipped: 1,
            success: 2,
            canceled: 3,
        };
        return statusMap[status] || 0;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.trangThai === statusFilter;
        const matchesSearch = order.maHD.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.tenKH.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div id="orders" className="page">
            <div className="page-header">
                <h4><i className="ti-shopping-cart"></i> Quản lý Đơn hàng</h4>
                <button className="btn-refresh" onClick={loadOrders}>
                    <i className="ti-reload"></i> Làm mới
                </button>
            </div>

            <div className="filter-bar">
                <div className="filter-item">
                    <label>Trạng thái:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Tất cả ({orders.length})</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="shipped">Đang giao</option>
                        <option value="success">Hoàn thành</option>
                        <option value="canceled">Đã hủy</option>
                    </select>
                </div>
                <div className="filter-item">
                    <input
                        type="text"
                        placeholder="Tìm kiếm đơn hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Đang tải dữ liệu...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Chưa có đơn hàng nào</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>SĐT</th>
                                <th>Ngày đặt</th>
                                <th>Trạng thái</th>
                                <th>Tổng tiền</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.maHD}</td>
                                    <td>{order.tenKH}</td>
                                    <td>{order.phone}</td>
                                    <td>{formatDate(order.ngayLap)}</td>
                                    <td>
                                        <select
                                            value={order.trangThai}
                                            onChange={(e) => handleStatusChange(order.id, getStatusNumber(e.target.value))}
                                            className={`status ${order.trangThai}`}
                                        >
                                            <option value="pending">Chờ xử lý</option>
                                            <option value="shipped">Đang giao</option>
                                            <option value="success">Hoàn thành</option>
                                            <option value="canceled">Đã hủy</option>
                                        </select>
                                    </td>
                                    <td>{formatPrice(order.tongTien)}</td>
                                    <td>
                                        <button
                                            title="Xem chi tiết"
                                            onClick={() => {
                                                alert(`Chi tiết đơn hàng ${order.maHD}:\n\nKhách hàng: ${order.tenKH}\nĐịa chỉ: ${order.address}\nSố sản phẩm: ${order.items.length}`);
                                            }}
                                        >
                                            <i className="ti-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
