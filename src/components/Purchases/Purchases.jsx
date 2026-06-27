import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';

const Purchases = () => {
  const navigate = useNavigate();
  const { purchases, fetchPurchases, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPurchases();
  }, []);

  const filteredPurchases = purchases.filter(p => 
    p.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.productId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h2>🛒 المشتريات</h2>
          <p style={styles.subtitle}>سجل فواتير الشراء من الموردين</p>
        </div>
        <Button
          variant="secondary"
          icon={<FaPlus />}
          onClick={() => navigate('/purchases/add')}
        >
          فاتورة شراء جديدة
        </Button>
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
            عدد الفواتير: {filteredPurchases.length}
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
                <th>سعر الشراء</th>
                <th>الإجمالي</th>
                <th>المورد</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((purchase, index) => (
                <tr key={purchase._id}>
                  <td>{index + 1}</td>
                  <td>{purchase.invoiceNumber}</td>
                  <td>{purchase.productId?.name || 'غير معروف'}</td>
                  <td>{purchase.quantity} {purchase.productId?.unit || ''}</td>
                  <td>{purchase.buyPrice} ج</td>
                  <td><strong>{purchase.totalPrice} ج</strong></td>
                  <td>{purchase.supplier || 'غير محدد'}</td>
                  <td>{new Date(purchase.purchaseDate).toLocaleDateString('ar-EG')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPurchases.length === 0 && (
            <div style={styles.empty}>
              <p>لا توجد فواتير شراء</p>
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
  },
  subtitle: {
    color: '#7F8C8D',
    marginTop: '4px',
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

export default Purchases;