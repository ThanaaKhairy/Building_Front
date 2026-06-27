import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

const AddPurchase = () => {
  const navigate = useNavigate();
  const { products, addPurchase, fetchProducts, loading } = useApp();
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    buyPrice: 0,
    supplier: '',
    supplierPhone: '',
    notes: '',
    isPaid: true,
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [total, setTotal] = useState(0);
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
        buyPrice: product.currentBuyPrice || 0,
      }));
    }
  }, [formData.productId, products]);

  useEffect(() => {
    setTotal(formData.quantity * formData.buyPrice);
  }, [formData.quantity, formData.buyPrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'supplier' || name === 'supplierPhone' || name === 'notes' || name === 'productId'
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

    try {
      await addPurchase(formData);
      navigate('/purchases');
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في تسجيل الشراء');
    }
  };

  return (
    <div className="fade-in">
      <div style={styles.header}>
        <h2>🛒 تسجيل فاتورة شراء</h2>
        <p style={styles.subtitle}>تسجيل وصول بضاعة جديدة من المورد</p>
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
                <Input
                  label="الكمية"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="مثال: 50"
                  required
                  min="0.1"
                  step="0.1"
                />

                <Input
                  label="سعر الشراء (جنيه)"
                  name="buyPrice"
                  type="number"
                  value={formData.buyPrice}
                  onChange={handleChange}
                  placeholder="مثال: 130"
                  required
                  min="0"
                  step="0.01"
                />

                <div style={styles.totalBox}>
                  <span style={styles.totalLabel}>الإجمالي:</span>
                  <span style={styles.totalValue}>{total.toFixed(2)} جنيه</span>
                </div>

                <Input
                  label="المورد"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  placeholder="اسم المورد"
                />

                <Input
                  label="تليفون المورد"
                  name="supplierPhone"
                  value={formData.supplierPhone}
                  onChange={handleChange}
                  placeholder="رقم التليفون"
                />
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
              onClick={() => navigate('/purchases')}
              type="button"
            >
              إلغاء
            </Button>
            <Button
              variant="secondary"
              type="submit"
              loading={loading}
            >
              💾 تسجيل الشراء
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
  totalBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: '#D5F5E3',
    borderRadius: '8px',
  },
  totalLabel: {
    fontWeight: 600,
    color: '#1A7A3A',
  },
  totalValue: {
    fontWeight: 700,
    color: '#27AE60',
    fontSize: '1.2rem',
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

export default AddPurchase;