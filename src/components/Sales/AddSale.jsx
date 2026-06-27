import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

const AddSale = () => {
  const navigate = useNavigate();
  const { products, addSale, fetchProducts, loading } = useApp();
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    sellPrice: 0,
    customer: '',
    customerPhone: '',
    paymentMethod: 'نقدي',
    notes: '',
    isPaid: true,
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [total, setTotal] = useState(0);
  const [profit, setProfit] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const product = products.find(p => p._id === formData.productId);
    setSelectedProduct(product);
    if (product) {
      setFormData(prev => ({
        ...prev,
        sellPrice: product.currentSellPrice || 0,
      }));
    }
  }, [formData.productId, products]);

  useEffect(() => {
    const qty = formData.quantity || 0;
    const price = formData.sellPrice || 0;
    setTotal(qty * price);
    
    if (selectedProduct) {
      const profitCalc = (price - selectedProduct.currentBuyPrice) * qty;
      setProfit(profitCalc || 0);
    }
  }, [formData.quantity, formData.sellPrice, selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'customer' || name === 'customerPhone' || name === 'notes' || name === 'productId' || name === 'paymentMethod'
        ? value
        : parseFloat(value) || 0,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.productId) {
      setError('يرجى اختيار المنتج');
      return;
    }

    if (selectedProduct && formData.quantity > selectedProduct.quantity) {
      setError(`الكمية غير متوفرة. المتوفر: ${selectedProduct.quantity} ${selectedProduct.unit}`);
      return;
    }

    try {
      await addSale(formData);
      navigate('/sales');
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في تسجيل البيع');
    }
  };

  return (
    <div className="fade-in">
      <div style={styles.header}>
        <h2>💰 تسجيل فاتورة بيع</h2>
        <p style={styles.subtitle}>تسجيل عملية بيع لعملاء</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <div style={styles.grid}>
            <Input
              label="المنتج"
              name="productId"
              type="select"
              value={formData.productId}
              onChange={handleChange}
              required
            >
              <option value="">اختر المنتج...</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name} - المخزون: {p.quantity} {p.unit}
                </option>
              ))}
            </Input>

            {selectedProduct && (
              <>
                <div style={styles.infoBox}>
                  <span>المخزون المتوفر: <strong>{selectedProduct.quantity} {selectedProduct.unit}</strong></span>
                  <span>سعر الشراء: <strong>{selectedProduct.currentBuyPrice} ج</strong></span>
                </div>

                <Input
                  label="الكمية"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="مثال: 10"
                  required
                  min="0.1"
                  step="0.1"
                />

                <Input
                  label="سعر البيع (جنيه)"
                  name="sellPrice"
                  type="number"
                  value={formData.sellPrice}
                  onChange={handleChange}
                  placeholder="مثال: 180"
                  required
                  min="0"
                  step="0.01"
                />

                <div style={styles.totalBox}>
                  <div style={styles.totalRow}>
                    <span style={styles.totalLabel}>الإجمالي:</span>
                    <span style={styles.totalValue}>{total.toFixed(2)} ج</span>
                  </div>
                  <div style={styles.totalRow}>
                    <span style={styles.totalLabel}>الربح المتوقع:</span>
                    <span style={{
                      ...styles.profitValue,
                      color: profit > 0 ? '#27AE60' : '#E74C3C',
                    }}>
                      {profit.toFixed(2)} ج
                    </span>
                  </div>
                </div>

                <Input
                  label="العميل"
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  placeholder="اسم العميل"
                />

                <Input
                  label="تليفون العميل"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="رقم التليفون"
                />

                <Input
                  label="طريقة الدفع"
                  name="paymentMethod"
                  type="select"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="نقدي">نقدي</option>
                  <option value="تحويل">تحويل بنكي</option>
                  <option value="أجل">أجل</option>
                  <option value="بطاقة">بطاقة</option>
                </Input>
              </>
            )}

            <div style={styles.fullWidth}>
              <Input
                label="ملاحظات"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="ملاحظات إضافية (اختياري)"
              />
            </div>

            <div style={styles.fullWidth}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="isPaid"
                  checked={formData.isPaid}
                  onChange={handleCheckboxChange}
                />
                تم الدفع
              </label>
            </div>
          </div>

          <div style={styles.actions}>
            <Button
              variant="outline"
              onClick={() => navigate('/sales')}
              type="button"
            >
              إلغاء
            </Button>
            <Button
              variant="success"
              type="submit"
              loading={loading}
            >
              💾 إتمام البيع
            </Button>
          </div>
        </form>
      </Card>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  infoBox: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 14px',
    background: '#D4E6F1',
    borderRadius: '8px',
    fontSize: '0.9rem',
    gridColumn: '1 / -1',
  },
  totalBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '12px 16px',
    background: '#FDEBD0',
    borderRadius: '8px',
    gridColumn: '1 / -1',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontWeight: 600,
    color: '#935E38',
  },
  totalValue: {
    fontWeight: 700,
    color: '#E67E22',
    fontSize: '1.1rem',
  },
  profitValue: {
    fontWeight: 700,
    fontSize: '1.1rem',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #ECF0F1',
  },
};

export default AddSale;