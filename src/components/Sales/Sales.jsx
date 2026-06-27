import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';

const Sales = () => {
  const navigate = useNavigate();
  const { sales, fetchSales, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSales();
  }, []);

  const filteredSales = sales.filter(s => 
    s.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.productId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // حساب إجمالي الأرباح
  const totalProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);

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
          <h2>💰 المبيعات</h2>
          <p style={styles.subtitle}>سجل فواتير البيع للعملاء</p>
        </div>
        <div style={styles.headerActions}>
          <span style={styles.totalProfit}>
            إجمالي الأرباح: <strong>{totalProfit.toFixed(2)} ج</strong>
          </span>
          <Button
            variant="success"
            icon={<FaPlus />}
            onClick={() => navigate('/sales/add')}
          >
            فاتورة بيع جديدة
          </Button>
        </div>
      </div>

      <Card>
        <div style={styles.toolbar}>
          <div style={styles.searchBox}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="بحث عن فاتورة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <span style={styles.count}>
            عدد الفواتير: {filteredSales.length}
          </span>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>رقم الفاتورة</th>
                <th>المنتج</th>
                <th>الكمية</th>
                <th>سعر البيع</th>
                <th>الإجمالي</th>
                <th>الربح</th>
                <th>العميل</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale, index) => (
                <tr key={sale._id}>
                  <td>{index + 1}</td>
                  <td>{sale.invoiceNumber}</td>
                  <td>{sale.productId?.name || 'غير معروف'}</td>
                  <td>{sale.quantity} {sale.productId?.unit || ''}</td>
                  <td>{sale.sellPrice} ج</td>
                  <td><strong>{sale.totalPrice} ج</strong></td>
                  <td style={{ color: sale.profit > 0 ? '#27AE60' : '#E74C3C' }}>
                    {sale.profit?.toFixed(2)} ج
                  </td>
                  <td>{sale.customer || 'عميل نقدي'}</td>
                  <td>{new Date(sale.saleDate).toLocaleDateString('ar-EG')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSales.length === 0 && (
            <div style={styles.empty}>
              <p>لا توجد فواتير بيع</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  subtitle: {
    color: '#7F8C8D',
    marginTop: '4px',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  totalProfit: {
    fontSize: '1rem',
    color: '#2C3E50',
    padding: '8px 16px',
    background: '#D5F5E3',
    borderRadius: '8px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    background: '#F5F6FA',
    borderRadius: '8px',
    padding: '8px 14px',
    flex: 1,
    maxWidth: '400px',
  },
  searchIcon: {
    color: '#7F8C8D',
    marginLeft: '10px',
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontFamily: "'Cairo', sans-serif",
    fontSize: '0.95rem',
    color: '#2C3E50',
    width: '100%',
  },
  count: {
    color: '#7F8C8D',
    fontSize: '0.9rem',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#7F8C8D',
  },
};

export default Sales;