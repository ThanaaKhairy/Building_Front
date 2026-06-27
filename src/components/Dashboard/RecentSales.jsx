import React from 'react';

const RecentSales = ({ sales }) => {
  const recentSales = sales.slice(0, 5);

  if (recentSales.length === 0) {
    return <p style={styles.noData}>لا توجد مبيعات حديثة</p>;
  }

  return (
    <div>
      {recentSales.map((sale) => (
        <div key={sale._id} style={styles.saleItem}>
          <div style={styles.saleInfo}>
            <span style={styles.saleName}>
              {sale.productId?.name || 'منتج غير معروف'}
            </span>
            <span style={styles.saleCustomer}>{sale.customer || 'عميل نقدي'}</span>
          </div>
          <div style={styles.saleDetails}>
            <span style={styles.saleQuantity}>
              {sale.quantity} {sale.productId?.unit || ''}
            </span>
            <span style={styles.salePrice}>{sale.totalPrice} ج</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  saleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #ECF0F1',
  },
  saleInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  saleName: {
    fontWeight: 600,
  },
  saleCustomer: {
    fontSize: '0.8rem',
    color: '#7F8C8D',
  },
  saleDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
  },
  saleQuantity: {
    fontSize: '0.85rem',
    color: '#7F8C8D',
  },
  salePrice: {
    fontWeight: 700,
    color: '#27AE60',
  },
  noData: {
    color: '#7F8C8D',
    textAlign: 'center',
    padding: '20px 0',
  },
};

export default RecentSales;