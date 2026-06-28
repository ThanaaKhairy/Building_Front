import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSave, FaTimes } from 'react-icons/fa';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';

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
      <div className="products-header">
        <div>
          <h2>📦 المنتجات</h2>
          <p className="products-subtitle">إدارة المنتجات والمخزون</p>
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
        <div className="products-toolbar">
          <div className="products-search">
            <FaSearch className="products-search-icon" />
            <input
              type="text"
              placeholder="بحث عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="products-search-input"
            />
          </div>
          <label className="products-filter">
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
                    
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={editForm.name || ''}
                          onChange={handleEditChange}
                          className="table-edit-input"
                        />
                      ) : (
                        <strong>{product.name}</strong>
                      )}
                    </td>
                    
                    <td>
                      {isEditing ? (
                        <select
                          name="unit"
                          value={editForm.unit || ''}
                          onChange={handleEditChange}
                          className="table-edit-input"
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
                    
                    <td className={product.quantity <= product.minStockWarning ? 'stock-low' : 'stock-ok'}>
                      {product.quantity}
                    </td>
                    
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          name="currentBuyPrice"
                          value={editForm.currentBuyPrice || 0}
                          onChange={handleEditChange}
                          className="table-edit-input price-input"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        `${product.currentBuyPrice} ج`
                      )}
                    </td>
                    
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          name="currentSellPrice"
                          value={editForm.currentSellPrice || 0}
                          onChange={handleEditChange}
                          className="table-edit-input price-input"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        `${product.currentSellPrice} ج`
                      )}
                    </td>
                    
                    <td>
                      <span className={`badge ${
                        product.quantity <= product.minStockWarning ? 'badge-danger' : 'badge-success'
                      }`}>
                        {product.quantity <= product.minStockWarning ? '⚠️ منخفض' : '✅ متوفر'}
                      </span>
                    </td>
                    
                    <td>
                      {isEditing ? (
                        <div className="table-actions">
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
                        <div className="table-actions">
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
            <div className="products-empty">
              <p>لا توجد منتجات</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Products;