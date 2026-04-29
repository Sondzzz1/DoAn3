// Artist Revenue - Quản lý doanh thu của họa sĩ
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAppContext } from '../../context/AppContext';

interface RevenueData {
  month: string;
  sales: number;
  revenue: number;
  commission: number;
  netRevenue: number;
}

interface Transaction {
  id: string;
  date: string;
  artworkName: string;
  price: number;
  commission: number;
  netAmount: number;
  status: 'completed' | 'pending';
}

const ArtistRevenue: React.FC = () => {
  const { user } = useAuth();
  const { artworks } = useAppContext();
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [totalStats, setTotalStats] = useState({
    totalRevenue: 0,
    totalCommission: 0,
    netRevenue: 0,
    totalSales: 0,
  });

  useEffect(() => {
    loadRevenueData();
  }, [user, selectedYear]);

  const loadRevenueData = () => {
    // Mock data - Trong thực tế sẽ load từ API
    const mockRevenue: RevenueData[] = [
      { month: '01/2026', sales: 5, revenue: 22500000, commission: 2250000, netRevenue: 20250000 },
      { month: '02/2026', sales: 3, revenue: 15000000, commission: 1500000, netRevenue: 13500000 },
      { month: '03/2026', sales: 7, revenue: 31500000, commission: 3150000, netRevenue: 28350000 },
      { month: '04/2026', sales: 4, revenue: 18000000, commission: 1800000, netRevenue: 16200000 },
    ];

    const mockTransactions: Transaction[] = [
      {
        id: '1',
        date: '2026-04-25',
        artworkName: 'Vàng Vọng Thinh Không',
        price: 5200000,
        commission: 520000,
        netAmount: 4680000,
        status: 'completed',
      },
      {
        id: '2',
        date: '2026-04-20',
        artworkName: 'Sang Đông',
        price: 4500000,
        commission: 450000,
        netAmount: 4050000,
        status: 'completed',
      },
      {
        id: '3',
        date: '2026-04-15',
        artworkName: 'Hạ Giã Ngói',
        price: 4200000,
        commission: 420000,
        netAmount: 3780000,
        status: 'pending',
      },
    ];

    setRevenueData(mockRevenue);
    setTransactions(mockTransactions);

    // Tính tổng
    const total = mockRevenue.reduce(
      (acc, curr) => ({
        totalRevenue: acc.totalRevenue + curr.revenue,
        totalCommission: acc.totalCommission + curr.commission,
        netRevenue: acc.netRevenue + curr.netRevenue,
        totalSales: acc.totalSales + curr.sales,
      }),
      { totalRevenue: 0, totalCommission: 0, netRevenue: 0, totalSales: 0 }
    );
    setTotalStats(total);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div id="revenue" className="page">
      <div className="page-header">
        <h4><i className="ti-money"></i> Doanh Thu</h4>
        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          style={{ padding: '8px 15px', borderRadius: '5px', border: '1px solid #ddd' }}
        >
          <option value={2026}>Năm 2026</option>
          <option value={2025}>Năm 2025</option>
          <option value={2024}>Năm 2024</option>
        </select>
      </div>

      <div className="dashboard" style={{ marginBottom: '30px' }}>
        <div className="card bg-success">
          <i className="ti-money" style={{ fontSize: '2rem' }}></i>
          <h3>{formatCurrency(totalStats.totalRevenue)}</h3>
          <p>Tổng Doanh Thu</p>
        </div>

        <div className="card bg-warning">
          <i className="ti-wallet" style={{ fontSize: '2rem' }}></i>
          <h3>{formatCurrency(totalStats.totalCommission)}</h3>
          <p>Hoa Hồng (10%)</p>
        </div>

        <div className="card bg-primary">
          <i className="ti-credit-card" style={{ fontSize: '2rem' }}></i>
          <h3>{formatCurrency(totalStats.netRevenue)}</h3>
          <p>Doanh Thu Ròng</p>
        </div>

        <div className="card bg-danger">
          <i className="ti-shopping-cart" style={{ fontSize: '2rem' }}></i>
          <h3>{totalStats.totalSales}</h3>
          <p>Tổng Đơn Hàng</p>
        </div>
      </div>

      <div className="block">
        <h4>Doanh Thu Theo Tháng</h4>
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Tháng</th>
                <th>Số đơn</th>
                <th>Doanh thu</th>
                <th>Hoa hồng (10%)</th>
                <th>Doanh thu ròng</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.map((data, index) => (
                <tr key={index}>
                  <td><strong>{data.month}</strong></td>
                  <td>{data.sales}</td>
                  <td>{formatCurrency(data.revenue)}</td>
                  <td style={{ color: '#ffc107' }}>{formatCurrency(data.commission)}</td>
                  <td style={{ color: '#28a745', fontWeight: 'bold' }}>
                    {formatCurrency(data.netRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f8f9fa', fontWeight: 'bold' }}>
                <td>TỔNG</td>
                <td>{totalStats.totalSales}</td>
                <td>{formatCurrency(totalStats.totalRevenue)}</td>
                <td style={{ color: '#ffc107' }}>{formatCurrency(totalStats.totalCommission)}</td>
                <td style={{ color: '#28a745' }}>{formatCurrency(totalStats.netRevenue)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="block">
        <h4>Giao Dịch Gần Đây</h4>
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Tác phẩm</th>
                <th>Giá bán</th>
                <th>Hoa hồng</th>
                <th>Thực nhận</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trans) => (
                <tr key={trans.id}>
                  <td>{new Date(trans.date).toLocaleDateString('vi-VN')}</td>
                  <td><strong>{trans.artworkName}</strong></td>
                  <td>{formatCurrency(trans.price)}</td>
                  <td style={{ color: '#ffc107' }}>{formatCurrency(trans.commission)}</td>
                  <td style={{ color: '#28a745', fontWeight: 'bold' }}>
                    {formatCurrency(trans.netAmount)}
                  </td>
                  <td>
                    <span className={`status ${trans.status === 'completed' ? 'status-success' : 'status-pending'}`}>
                      {trans.status === 'completed' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ 
        background: '#fff3cd', 
        border: '1px solid #ffc107', 
        borderRadius: '8px', 
        padding: '15px', 
        marginTop: '20px' 
      }}>
        <p style={{ margin: 0, color: '#856404' }}>
          <i className="ti-info-alt"></i> <strong>Lưu ý:</strong> Hoa hồng 10% được trừ từ mỗi giao dịch. 
          Doanh thu ròng sẽ được chuyển vào tài khoản của bạn vào cuối mỗi tháng.
        </p>
      </div>
    </div>
  );
};

export default ArtistRevenue;
