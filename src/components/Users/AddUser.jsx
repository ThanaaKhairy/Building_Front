import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

const AddUser = () => {
  const navigate = useNavigate();
  const { addUser, loading } = useApp();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // التحقق من كلمة المرور
    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    try {
      await addUser(formData);
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في إضافة المستخدم');
    }
  };

  return (
    <div className="fade-in">
      <div style={styles.header}>
        <h2>👤 إضافة أدمن جديد</h2>
        <p style={styles.subtitle}>إضافة حساب أدمن جديد للنظام</p>
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
              label="اسم المستخدم"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="أدخل اسم المستخدم"
              required
            />

            <Input
              label="البريد الإلكتروني"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              required
            />

            <Input
              label="كلمة المرور"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="6 أحرف على الأقل"
              required
            />

            <Input
              label="الاسم الكامل"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="الاسم الكامل"
              required
            />

            <Input
              label="رقم التليفون"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="رقم التليفون (اختياري)"
            />
          </div>

          <div style={styles.infoBox}>
            <p>ℹ️ سيتم إنشاء المستخدم بصلاحية <strong>أدمن</strong> تلقائياً</p>
          </div>

          <div style={styles.actions}>
            <Button
              variant="outline"
              onClick={() => navigate('/users')}
              type="button"
            >
              إلغاء
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={loading}
            >
              👤 إضافة الأدمن
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
  infoBox: {
    padding: '12px 16px',
    background: '#D4E6F1',
    borderRadius: '8px',
    fontSize: '0.9rem',
    color: '#1A5276',
    marginTop: '16px',
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

export default AddUser;