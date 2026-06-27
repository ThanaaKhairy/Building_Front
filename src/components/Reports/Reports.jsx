import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import { 
  FaCalendarDay, 
  FaCalendarAlt, 
  FaDollarSign, 
  FaShoppingCart, 
  FaBox,
  FaExclamationTriangle,
  FaChartLine,
  FaTrophy
} from 'react-icons/fa';

const Reports = () => {
  const { sales, products, fetchSales, fetchProducts, loading } = useApp();
  const [dailyProfit, setDailyProfit] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [todaySales, setTodaySales] = useState([]);

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (sales.length === 0) return;

    // حساب إجمالي الأرباح والإيرادات
    const totalRev = sales.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
    const totalProf = sales.reduce((sum, s) => sum + (s.profit || 0), 0);
    setTotalRevenue(totalRev);
    setTotalProfit(totalProf);
    
    // حساب أرباح اليوم
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySalesData = sales.filter(s => new Date(s.saleDate) >= today);
    setTodaySales(todaySalesData);
    const todayProfit = todaySalesData.reduce((sum, s) => sum + (s.profit || 0), 0);
    setDailyProfit(todayProfit);

    // حساب أرباح الشهر
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthSales = sales.filter(s => new Date(s.saleDate) >= startOfMonth);
    const monthProfit = monthSales.reduce((sum, s) => sum + (s.profit || 0), 0);
    setMonthlyProfit(monthProfit);
  }, [sales]);

  // حساب المنتجات الأكثر مبيعاً
  const getTopProducts = () => {
    const productSales = {};
    sales.forEach(sale => {
      const name = sale.productId?.name || 'غير معروف';
      if (!productSales[name]) {
        productSales[name] = { 
          quantity: 0, 
          revenue: 0, 
          profit: 0 
        };
      }
      productSales[name].quantity += sale.quantity || 0;
      productSales[name].revenue += sale.totalPrice || 0;
      productSales[name].profit += sale.profit || 0;
    });
    
    return Object.entries(productSales)
      .sort((a, b) => b[1].quantity - a[1].quantity)
      .slice(0, 5);
  };

  const topProducts = getTopProducts();
  const lowStockProducts = products.filter(p => p.quantity <= p.minStockWarning);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={styles.header}>
        <div>
          <h2>📊 التقارير</h2>
          <p style={styles.subtitle}>نظرة شاملة على أداء المبيعات والأرباح</p>
        </div>
      </div>

      {/* ✅ الإحصائيات السريعة */}
      <div className="stats-grid">
        <div className="stat-card success">
          <div className="stat-icon"><FaDollarSign /></div>
          <div className="stat-value">{dailyProfit.toFixed(2)} ج</div>
          <div className="stat-label">💰 أرباح اليوم</div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon"><FaCalendarAlt /></div>
          <div className="stat-value">{monthlyProfit.toFixed(2)} ج</div>
          <div className="stat-label">📅 أرباح الشهر</div>
        </div>
        <div className="stat-card primary">
          <div className="stat-icon"><FaShoppingCart /></div>
          <div className="stat-value">{sales.length}</div>
          <div className="stat-label">📦 إجمالي المبيعات</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon"><FaBox /></div>
          <div className="stat-value">{products.length}</div>
          <div className="stat-label">🏷️ عدد المنتجات</div>
        </div>
      </div>

      {/* ✅ إحصائيات إضافية */}
      <div style={styles.extraStats}>
        <div style={styles.extraStat}>
          <span style={styles.extraLabel}>إجمالي الإيرادات</span>
          <span style={styles.extraValue}>{totalRevenue.toFixed(2)} ج</span>
        </div>
        <div style={styles.extraStat}>
          <span style={styles.extraLabel}>إجمالي الأرباح</span>
          <span style={{ ...styles.extraValue, color: '#27AE60' }}>{totalProfit.toFixed(2)} ج</span>
        </div>
        <div style={styles.extraStat}>
          <span style={styles.extraLabel}>متوسط الفاتورة</span>
          <span style={styles.extraValue}>
            {sales.length > 0 
              ? (totalRevenue / sales.length).toFixed(2) 
              : 0} ج
          </span>
        </div>
        <div style={styles.extraStat}>
          <span style={styles.extraLabel}>المنتجات المنخفضة</span>
          <span style={{ ...styles.extraValue, color: lowStockProducts.length > 0 ? '#E74C3C' : '#27AE60' }}>
            {lowStockProducts.length}
          </span>
        </div>
      </div>

      {/* ✅ أفضل المنتجات مبيعاً */}
      <Card title={<><FaTrophy /> أفضل المنتجات مبيعاً</>}>
        {topProducts.length === 0 ? (
          <p style={styles.noData}>لا توجد مبيعات مسجلة</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>المنتج</th>
                  <th>الكمية المباعة</th>
                  <th>الإيرادات</th>
                  <th>الأرباح</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map(([name, data], index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td><strong>{name}</strong></td>
                    <td>{data.quantity}</td>
                    <td>{data.revenue.toFixed(2)} ج</td>
                    <td style={{ color: data.profit > 0 ? '#27AE60' : '#E74C3C' }}>
                      {data.profit.toFixed(2)} ج
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ✅ مبيعات اليوم */}
      <div style={styles.grid}>
        <Card title={<><FaCalendarDay /> مبيعات اليوم ({todaySales.length})</>}>
          {todaySales.length === 0 ? (
            <p style={styles.noData}>لا توجد مبيعات اليوم</p>
          ) : (
            <div>
              {todaySales.slice(0, 5).map((sale, index) => (
                <div key={sale._id} style={styles.saleItem}>
                  <div>
                    <span style={styles.saleName}>{sale.productId?.name || 'غير معروف'}</span>
                    <span style={styles.saleDetails}>
                      {sale.quantity} × {sale.sellPrice} ج
                    </span>
                  </div>
                  <div style={styles.saleTotal}>
                    <span>{sale.totalPrice} ج</span>
                    <span style={{ 
                      color: sale.profit > 0 ? '#27AE60' : '#E74C3C',
                      fontSize: '0.8rem'
                    }}>
                      (+{sale.profit} ج)
                    </span>
                  </div>
                </div>
              ))}
              {todaySales.length > 5 && (
                <p style={styles.moreText}>... و {todaySales.length - 5} مبيعات أخرى</p>
              )}
            </div>
          )}
        </Card>

        {/* ✅ تنبيهات المخزون المنخفض */}
        <Card title={<><FaExclamationTriangle /> تنبيهات المخزون</>}>
          {lowStockProducts.length === 0 ? (
            <p style={styles.noData}>✅ جميع المنتجات في المخزون كافية</p>
          ) : (
            <div>
              {lowStockProducts.map(p => (
                <div key={p._id} style={styles.lowStockItem}>
                  <div>
                    <span style={styles.lowStockName}>{p.name}</span>
                    <span style={styles.lowStockUnit}>{p.unit}</span>
                  </div>
                  <div>
                    <span style={styles.lowStockQuantity}>{p.quantity}</span>
                    <span style={styles.lowStockWarning}>⚠️ منخفض</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  subtitle: {
    color: '#7F8C8D',
    marginTop: '4px',
  },
  extraStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  extraStat: {
    background: '#fff',
    padding: '16px 20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  extraLabel: {
    color: '#7F8C8D',
    fontSize: '0.9rem',
  },
  extraValue: {
    fontWeight: 700,
    fontSize: '1.1rem',
    color: '#2C3E50',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginTop: '20px',
  },
  saleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #ECF0F1',
  },
  saleName: {
    fontWeight: 600,
    display: 'block',
  },
  saleDetails: {
    fontSize: '0.85rem',
    color: '#7F8C8D',
  },
  saleTotal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
  },
  moreText: {
    color: '#7F8C8D',
    fontSize: '0.85rem',
    marginTop: '8px',
    textAlign: 'center',
  },
  lowStockItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    background: '#FADBD8',
    borderRadius: '8px',
    marginBottom: '8px',
  },
  lowStockName: {
    fontWeight: 600,
  },
  lowStockUnit: {
    fontSize: '0.8rem',
    color: '#7F8C8D',
    marginRight: '8px',
  },
  lowStockQuantity: {
    fontWeight: 700,
    color: '#E74C3C',
    marginRight: '12px',
  },
  lowStockWarning: {
    color: '#E74C3C',
    fontWeight: 600,
    fontSize: '0.8rem',
    background: '#fff',
    padding: '2px 10px',
    borderRadius: '12px',
  },
  noData: {
    color: '#7F8C8D',
    textAlign: 'center',
    padding: '20px 0',
  },
};

export default Reports;