import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct, loading } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    unit: 'قطعة',
    currentBuyPrice: 0,
    currentSellPrice: 0,
    quantity: 0,
    minStockWarning: 10,
    category: 'عام',
    description: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'name' || name === 'category' || name === 'description' || name === 'unit' 
        ? value 
        : parseFloat(value) || 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await addProduct(formData);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في إضافة المنتج');
    }
  };

  return (
    <div className="fade-in">
      <div style={styles.header}>
        <h2>➕ إضافة منتج جديد</h2>
        <p style={styles.subtitle}>أدخل بيانات المنتج لإضافته إلى المخزون</p>
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
              label="اسم المنتج"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="أدخل اسم المنتج"
              required
            />

            <Input
              label="الوحدة"
              name="unit"
              type="select"
              value={formData.unit}
              onChange={handleChange}
              required
            >
              <option value="كيس">كيس</option>
              <option value="طوبة">طوبة</option>
              <option value="متر">متر</option>
              <option value="كيلو">كيلو</option>
              <option value="طن">طن</option>
              <option value="قطعة">قطعة</option>
              <option value="علبة">علبة</option>
              <option value="ربطة">ربطة</option>
            </Input>

            <Input
              label="سعر الشراء (جنيه)"
              name="currentBuyPrice"
              type="number"
              value={formData.currentBuyPrice}
              onChange={handleChange}
              placeholder="مثال: 120"
              required
              min="0"
              step="0.01"
            />

            <Input
              label="سعر البيع (جنيه)"
              name="currentSellPrice"
              type="number"
              value={formData.currentSellPrice}
              onChange={handleChange}
              placeholder="مثال: 150"
              required
              min="0"
              step="0.01"
            />

            <Input
              label="الكمية الأولية"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="مثال: 100"
              required
              min="0"
            />

            <Input
              label="حد التنبيه (الكمية)"
              name="minStockWarning"
              type="number"
              value={formData.minStockWarning}
              onChange={handleChange}
              placeholder="مثال: 20"
              required
              min="0"
            />

            <Input
              label="التصنيف"
              name="category"
              type="select"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="عام">عام</option>
              <option value="أسمنت">أسمنت</option>
              <option value="حديد">حديد</option>
              <option value="طوب">طوب</option>
              <option value="رمل">رمل</option>
              <option value="خشب">خشب</option>
              <option value="كهرباء">كهرباء</option>
              <option value="سباكة">سباكة</option>
            </Input>

            <div style={styles.fullWidth}>
              <Input
                label="الوصف"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="وصف إضافي للمنتج (اختياري)"
              />
            </div>
          </div>

          <div style={styles.actions}>
            <Button
              variant="outline"
              onClick={() => navigate('/products')}
              type="button"
            >
              إلغاء
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={loading}
            >
              💾 حفظ المنتج
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
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #ECF0F1',
  },
};

export default AddProduct;