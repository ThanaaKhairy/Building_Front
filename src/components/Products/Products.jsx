import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSave, FaTimes } from 'react-icons/fa';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

const Products = () => {
  const navigate = useNavigate();
  const { products, fetchProducts, deleteProduct, updateProduct, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    unit: '',
    currentBuyPrice: 0,
    currentSellPrice: 0,
    minStockWarning: 10,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ بدء التعديل
  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name,
      unit: product.unit,
      currentBuyPrice: product.currentBuyPrice,
      currentSellPrice: product.currentSellPrice,
      minStockWarning: product.minStockWarning,
    });
  };

  // ✅ حفظ التعديل
  const handleUpdate = async (id) => {
    try {
      await updateProduct(id, editForm);
      setEditingProduct(null);
      await fetchProducts();
    } catch (error) {
      alert('❌ فشل تحديث المنتج: ' + error.message);
    }
  };

  // ✅ إلغاء التعديل
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditForm({});
  };

  // ✅ حذف منتج
  const handleDelete = async (id, name) => {
    if (window.confirm(`⚠️ هل أنت متأكد من حذف المنتج "${name}"؟`)) {
      try {
        await deleteProduct(id);
        await fetchProducts();
      } catch (error) {
        alert('❌ فشل حذف المنتج: ' + error.message);
      }
    }
  };

  // ✅ تغيير بيانات التعديل
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === 'name' || name === 'unit' 
        ? value 
        : parseFloat(value) || 0,
    });
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.includes(searchTerm);
    const matchLowStock = filterLowStock ? p.quantity <= p.minStockWarning : true;
    return matchSearch && matchLowStock;
  });

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
          <h2>📦 المنتجات</h2>
          <p style={styles.subtitle}>إدارة المنتجات والمخزون</p>
        </div>
        <Button
          variant="primary"
          icon={<FaPlus />}
          onClick={() => navigate('/products/add')}
        >
          إضافة منتج جديد
        </Button>
      </div>

      <Card>
        <div style={styles.toolbar}>
          <div style={styles.searchBox}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="بحث عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <label style={styles.filterLabel}>
            <input
              type="checkbox"
              checked={filterLowStock}
              onChange={(e) => setFilterLowStock(e.target.checked)}
            />
            عرض المنتجات المنخفضة فقط
          </label>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>المنتج</th>
                <th>الوحدة</th>
                <th>الكمية</th>
                <th>سعر الشراء</th>
                <th>سعر البيع</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => {
                const isEditing = editingProduct === product._id;
                
                return (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    
                    {/* ✅ عمود المنتج - قابل للتعديل */}
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={editForm.name || ''}
                          onChange={handleEditChange}
                          style={styles.editInput}
                        />
                      ) : (
                        <strong>{product.name}</strong>
                      )}
                    </td>
                    
                    {/* ✅ عمود الوحدة - قابل للتعديل */}
                    <td>
                      {isEditing ? (
                        <select
                          name="unit"
                          value={editForm.unit || ''}
                          onChange={handleEditChange}
                          style={styles.editInput}
                        >
                          <option value="كيس">كيس</option>
                          <option value="طوبة">طوبة</option>
                          <option value="متر">متر</option>
                          <option value="كيلو">كيلو</option>
                          <option value="طن">طن</option>
                          <option value="قطعة">قطعة</option>
                          <option value="علبة">علبة</option>
                          <option value="ربطة">ربطة</option>
                        </select>
                      ) : (
                        product.unit
                      )}
                    </td>
                    
                    {/* ✅ عمود الكمية - غير قابل للتعديل (للقراءة فقط) */}
                    <td style={{
                      color: product.quantity <= product.minStockWarning ? '#E74C3C' : '#2C3E50',
                      fontWeight: product.quantity <= product.minStockWarning ? 700 : 400,
                    }}>
                      {product.quantity}
                    </td>
                    
                    {/* ✅ عمود سعر الشراء - قابل للتعديل */}
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          name="currentBuyPrice"
                          value={editForm.currentBuyPrice || 0}
                          onChange={handleEditChange}
                          style={{ ...styles.editInput, width: '80px' }}
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        `${product.currentBuyPrice} ج`
                      )}
                    </td>
                    
                    {/* ✅ عمود سعر البيع - قابل للتعديل */}
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          name="currentSellPrice"
                          value={editForm.currentSellPrice || 0}
                          onChange={handleEditChange}
                          style={{ ...styles.editInput, width: '80px' }}
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        `${product.currentSellPrice} ج`
                      )}
                    </td>
                    
                    {/* ✅ عمود الحالة */}
                    <td>
                      <span className={`badge ${
                        product.quantity <= product.minStockWarning ? 'badge-danger' : 'badge-success'
                      }`}>
                        {product.quantity <= product.minStockWarning ? '⚠️ منخفض' : '✅ متوفر'}
                      </span>
                    </td>
                    
                    {/* ✅ عمود الإجراءات */}
                    <td>
                      {isEditing ? (
                        <div style={styles.editActions}>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleUpdate(product._id)}
                            title="حفظ"
                          >
                            <FaSave />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                            title="إلغاء"
                          >
                            <FaTimes />
                          </Button>
                        </div>
                      ) : (
                        <div style={styles.actions}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                            title="تعديل"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(product._id, product.name)}
                            title="حذف"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div style={styles.empty}>
              <p>لا توجد منتجات</p>
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
  filterLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    color: '#2C3E50',
    cursor: 'pointer',
  },
  editInput: {
    padding: '4px 8px',
    border: '2px solid #C0392B',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontFamily: "'Cairo', sans-serif",
    width: '100%',
    minWidth: '60px',
    background: '#fff',
  },
  actions: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  editActions: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#7F8C8D',
  },
};

export default Products;