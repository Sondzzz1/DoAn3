// Admin Report - Báo cáo và thống kê chi tiết
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

interface ReportData {
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  totalItemsSold: number;
  dailyData: {
    date: string;
    revenue: number;
    profit: number;
    orders: number;
  }[];
  topSellingArtworks: {
    id: string;
    name: string;
    sold: number;
    revenue: number;
  }[];
  revenueByCategory: {
    category: string;
    revenue: number;
    percentage: number;
  }[];
}

const AdminReport: React.FC = () => {
    const { artworks } = useAppContext();
    const [reportType, setReportType] = useState('sales');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState<ReportData>({
        totalRevenue: 24000000,
        totalProfit: 10000000,
        totalOrders: 12,
        totalItemsSold: 15,
        dailyData: [
            { date: '2026-04-20', revenue: 4500000, profit: 1500000, orders: 2 },
            { date: '2026-04-21', revenue: 6000000, profit: 2000000, orders: 3 },
            { date: '2026-04-22', revenue: 3500000, profit: 1200000, orders: 1 },
            { date: '2026-04-23', revenue: 5000000, profit: 1800000, orders: 3 },
            { date: '2026-04-24', revenue: 5000000, profit: 1500000, orders: 3 },
        ],
        topSellingArtworks: [
            { id: '1', name: 'Vàng Vọng Thinh Không', sold: 5, revenue: 7500000 },
            { id: '2', name: 'Sang Đông', sold: 4, revenue: 6000000 },
            { id: '3', name: 'Phố Băng', sold: 3, revenue: 4500000 },
        ],
        revenueByCategory: [
            { category: 'Tranh sơn dầu', revenue: 12000000, percentage: 50 },
            { category: 'Tranh sơn mài', revenue: 7200000, percentage: 30 },
            { category: 'Tranh cổ điển', revenue: 4800000, percentage: 20 },
        ],
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const handleGenerateReport = () => {
        // TODO: Call API to generate report with date range
        console.log('Generate report:', { reportType, startDate, endDate });
        alert('Đang tạo báo cáo...');
    };

    const handlePrintReport = () => {
        window.print();
    };

    const handleExportExcel = () => {
        alert('Xuất Excel - Chức năng đang phát triển');
        // TODO: Implement Excel export
    };

    return (
        <div id="report" className="page">
            <h4><i className="ti-bar-chart"></i> Báo cáo thống kê</h4>

            <div className="filter-bar report-filter">
                <div className="filter-item">
                    <label>Loại báo cáo:</label>
                    <select 
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value="sales">Doanh thu & Lợi nhuận</option>
                        <option value="orders">Đơn hàng</option>
                        <option value="inventory">Tồn kho</option>
                        <option value="bestselling">Bán chạy</option>
                    </select>
                </div>
                <div className="filter-item">
                    <label>Từ ngày:</label>
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="filter-item">
                    <label>Đến ngày:</label>
                    <input 
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <button className="add-btn" onClick={handleGenerateReport}>
                    <i className="ti-search"></i> Xem báo cáo
                </button>
                <button 
                    className="add-btn" 
                    style={{ background: '#17a2b8', marginLeft: '10px' }}
                    onClick={handlePrintReport}
                >
                    <i className="ti-printer"></i> In báo cáo
                </button>
                <button 
                    className="add-btn" 
                    style={{ background: '#28a745', marginLeft: '10px' }}
                    onClick={handleExportExcel}
                >
                    <i className="ti-download"></i> Xuất Excel
                </button>
            </div>

            {/* Summary Cards */}
            <div className="dashboard report-summary">
                <div className="card bg-success">
                    <i className="ti-money"></i>
                    <p>Tổng Doanh thu</p>
                    <h3>{formatCurrency(reportData.totalRevenue)}</h3>
                </div>
                <div className="card bg-danger">
                    <i className="ti-stats-up"></i>
                    <p>Tổng Lợi nhuận</p>
                    <h3>{formatCurrency(reportData.totalProfit)}</h3>
                </div>
                <div className="card bg-primary">
                    <i className="ti-shopping-cart-full"></i>
                    <p>Tổng Đơn hàng</p>
                    <h3>{reportData.totalOrders}</h3>
                </div>
                <div className="card bg-warning">
                    <i className="ti-layers"></i>
                    <p>Tranh bán ra</p>
                    <h3>{reportData.totalItemsSold}</h3>
                </div>
            </div>

            {/* Daily Revenue Table */}
            <div className="block report-detail">
                <h4 style={{ marginTop: '20px' }}>Doanh Thu Theo Ngày</h4>
                <div className="table-container">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Ngày</th>
                                <th>Doanh thu</th>
                                <th>Lợi nhuận</th>
                                <th>Số đơn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.dailyData.map((day, index) => (
                                <tr key={index}>
                                    <td>{formatDate(day.date)}</td>
                                    <td>{formatCurrency(day.revenue)}</td>
                                    <td>{formatCurrency(day.profit)}</td>
                                    <td>{day.orders}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr style={{ fontWeight: 'bold', background: '#f8f9fa' }}>
                                <td>Tổng cộng</td>
                                <td>{formatCurrency(reportData.totalRevenue)}</td>
                                <td>{formatCurrency(reportData.totalProfit)}</td>
                                <td>{reportData.totalOrders}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Top Selling Artworks */}
            <div className="block report-detail">
                <h4 style={{ marginTop: '20px' }}>Top Tác Phẩm Bán Chạy</h4>
                <div className="table-container">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Xếp hạng</th>
                                <th>Tên tác phẩm</th>
                                <th>Số lượng bán</th>
                                <th>Doanh thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.topSellingArtworks.map((artwork, index) => (
                                <tr key={artwork.id}>
                                    <td>
                                        <span style={{
                                            display: 'inline-block',
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            background: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32',
                                            color: 'white',
                                            textAlign: 'center',
                                            lineHeight: '30px',
                                            fontWeight: 'bold',
                                        }}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td><strong>{artwork.name}</strong></td>
                                    <td>{artwork.sold}</td>
                                    <td>{formatCurrency(artwork.revenue)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Revenue by Category */}
            <div className="block report-detail">
                <h4 style={{ marginTop: '20px' }}>Doanh Thu Theo Danh Mục</h4>
                <div className="table-container">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Danh mục</th>
                                <th>Doanh thu</th>
                                <th>Tỷ lệ</th>
                                <th>Biểu đồ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.revenueByCategory.map((cat, index) => (
                                <tr key={index}>
                                    <td><strong>{cat.category}</strong></td>
                                    <td>{formatCurrency(cat.revenue)}</td>
                                    <td>{cat.percentage}%</td>
                                    <td>
                                        <div style={{
                                            width: '100%',
                                            height: '20px',
                                            background: '#e9ecef',
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                        }}>
                                            <div style={{
                                                width: `${cat.percentage}%`,
                                                height: '100%',
                                                background: index === 0 ? '#667eea' : index === 1 ? '#28a745' : '#ffc107',
                                                transition: 'width 0.3s',
                                            }}></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Chart Placeholder */}
            <div className="block report-detail">
                <h4 style={{ marginTop: '20px' }}>Biểu Đồ Doanh Thu</h4>
                <div style={{
                    padding: '60px',
                    background: '#f8f9fa',
                    borderRadius: '10px',
                    textAlign: 'center',
                    color: '#666',
                }}>
                    <i className="ti-bar-chart" style={{ fontSize: '3rem', marginBottom: '20px' }}></i>
                    <p>Biểu đồ sẽ được hiển thị ở đây</p>
                    <p style={{ fontSize: '0.9rem' }}>
                        (Cần tích hợp thư viện Chart.js hoặc Recharts)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminReport;
