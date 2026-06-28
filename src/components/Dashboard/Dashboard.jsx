import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import StatsCard from './StatsCard';
import RecentSales from './RecentSales';
import { FaBox, FaDollarSign, FaShoppingCart, FaExclamationTriangle } from 'react-icons/fa';
import Card from '../common/Card';

const Dashboard = () => {
  const { stats, products, sales, loading, fetchProducts, fetchSales } = useApp();

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  const statsData = [
    {
      title: 'المنتجات',
      value: stats.totalProducts,
      icon: <FaBox />,
      color: '#3498DB',
      bgColor: '#D4E6F1',
    },
    {
      title: 'المبيعات اليومية',
      value: `${stats.totalProfit || 0} ج`,
      icon: <FaDollarSign />,
      color: '#27AE60',
      bgColor: '#D5F5E3',
    },
    {
      title: 'عدد الفواتير',
      value: stats.totalSales || 0,
      icon: <FaShoppingCart />,
      color: '#E67E22',
      bgColor: '#FDEBD0',
    },
    {
      title: 'مخزون منخفض',
      value: stats.lowStockCount || 0,
      icon: <FaExclamationTriangle />,
      color: '#E74C3C',
      bgColor: '#FADBD8',
    },
  ];

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
        <h2>📊 لوحة التحكم</h2>
        <p style={styles.subtitle}>مرحباً بك في نظام إدارة مخزون مواد البناء</p>
      </div>

      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="dashboard-grid">
        <Card title="📈 آخر المبيعات">
          <RecentSales sales={sales} />
        </Card>
        <Card title="⚠️ المنتجات المنخفضة">
          <div style={styles.lowStockList}>
            {products.filter(p => p.quantity <= p.minStockWarning).length === 0 ? (
              <p style={styles.noData}>✅ جميع المنتجات في المخزون كافية</p>
            ) : (
              products
                .filter(p => p.quantity <= p.minStockWarning)
                .map(p => (
                  <div key={p._id} style={styles.lowStockItem}>
                    <span style={styles.lowStockName}>{p.name}</span>
                    <span style={styles.lowStockQuantity}>
                      {p.quantity} {p.unit}
                    </span>
                    <span style={styles.lowStockWarning}>⚠️ منخفض</span>
                  </div>
                ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

const styles = {
  header: {
    marginBottom: '24px',
  },
  subtitle: {
    color: '#7F8C8D',
    marginTop: '4px',
  },
  lowStockList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  lowStockItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    background: '#FADBD8',
    borderRadius: '8px',
  },
  lowStockName: {
    fontWeight: 600,
  },
  lowStockQuantity: {
    fontWeight: 600,
    color: '#E74C3C',
  },
  lowStockWarning: {
    color: '#E74C3C',
    fontWeight: 600,
  },
  noData: {
    color: '#7F8C8D',
    textAlign: 'center',
    padding: '20px 0',
  },
};

export default Dashboard;