import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [users, setUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalProfit: 0,
    lowStockCount: 0,
  });

  // ========== جلب بيانات المستخدم الحالي ==========
  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setCurrentUser(res.data.data);
      localStorage.setItem('user', JSON.stringify(res.data.data));
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // ========== جلب المنتجات ==========
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data.data || []);
      const lowStock = res.data.data?.filter(p => p.quantity <= p.minStockWarning) || [];
      setStats(prev => ({
        ...prev,
        totalProducts: res.data.data?.length || 0,
        lowStockCount: lowStock.length,
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في جلب المنتجات');
    } finally {
      setLoading(false);
    }
  };

  // ========== جلب المبيعات ==========
  const fetchSales = async () => {
    try {
      const res = await api.get('/sales');
      setSales(res.data.data || []);
      setStats(prev => ({
        ...prev,
        totalSales: res.data.data?.length || 0,
        totalProfit: res.data.stats?.totalProfit || 0,
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في جلب المبيعات');
    }
  };

  // ========== جلب المشتريات ==========
  const fetchPurchases = async () => {
    try {
      const res = await api.get('/purchases');
      setPurchases(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في جلب المشتريات');
    }
  };

  // ========== جلب المستخدمين (للسوبر أدمن فقط) ==========
  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في جلب المستخدمين');
    }
  };

  // ========== جلب سجل النشاطات ==========
  const fetchActivityLogs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/activity-logs?page=${page}&limit=50`);
      setActivityLogs(res.data.data || []);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في جلب سجل النشاطات');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========== جلب نشاطات مستخدم معين ==========
  const fetchUserActivityLogs = async (userId, page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/activity-logs/user/${userId}?page=${page}&limit=50`);
      setActivityLogs(res.data.data || []);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في جلب نشاطات المستخدم');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========== إضافة منتج ==========
  const addProduct = async (productData) => {
    setLoading(true);
    try {
      const res = await api.post('/products', productData);
      await fetchProducts();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في إضافة المنتج');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========== تحديث منتج ==========
  const updateProduct = async (id, productData) => {
    setLoading(true);
    try {
      const res = await api.put(`/products/${id}`, productData);
      await fetchProducts();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في تحديث المنتج');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========== حذف منتج ==========
  const deleteProduct = async (id) => {
    try {
      const res = await api.delete(`/products/${id}`);
      await fetchProducts();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في حذف المنتج');
      throw err;
    }
  };

  // ========== تسجيل شراء ==========
  const addPurchase = async (purchaseData) => {
    setLoading(true);
    try {
      const res = await api.post('/purchases', purchaseData);
      await fetchProducts();
      await fetchPurchases();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في تسجيل الشراء');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========== تسجيل بيع ==========
  const addSale = async (saleData) => {
    setLoading(true);
    try {
      const res = await api.post('/sales', saleData);
      await fetchProducts();
      await fetchSales();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في تسجيل البيع');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========== إضافة مستخدم (للسوبر أدمن فقط) ==========
  const addUser = async (userData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', userData);
      await fetchUsers();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في إضافة المستخدم');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========== تحديث مستخدم (للسوبر أدمن فقط) ==========
  const updateUser = async (id, userData) => {
    setLoading(true);
    try {
      const res = await api.put(`/auth/users/${id}`, userData);
      await fetchUsers();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في تحديث المستخدم');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========== حذف مستخدم (للسوبر أدمن فقط) ==========
  const deleteUser = async (id) => {
    try {
      const res = await api.delete(`/auth/users/${id}`);
      await fetchUsers();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في حذف المستخدم');
      throw err;
    }
  };

  // ========== تسجيل الخروج ==========
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    window.location.href = '/login';
  };

  // ========== تحميل البيانات الأولية ==========
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData._id) {
      setCurrentUser(userData);
    }

    const token = localStorage.getItem('token');
    if (token) {
      fetchProducts();
      fetchSales();
      fetchPurchases();
      
      if (userData.role === 'super_admin') {
        fetchUsers();
      }
    }
  }, []);

  const value = {
    products,
    sales,
    purchases,
    users,
    activityLogs,
    loading,
    error,
    currentUser,
    stats,
    setStats,
    fetchProducts,
    fetchSales,
    fetchPurchases,
    fetchUsers,
    fetchCurrentUser,
    fetchActivityLogs,
    fetchUserActivityLogs,
    addProduct,
    updateProduct,
    deleteProduct,
    addPurchase,
    addSale,
    addUser,
    updateUser,
    deleteUser,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};