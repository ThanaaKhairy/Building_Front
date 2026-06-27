import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { 
  FaSearch, 
  FaFilter, 
  FaCalendar,
  FaUser,
  FaBox,
  FaShoppingCart,
  FaDollarSign,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSignInAlt,
} from 'react-icons/fa';
import './ActivityLog.css';

const ActivityLog = () => {
  const { fetchActivityLogs, activityLogs, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterEntity, setFilterEntity] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchActivityLogs(currentPage);
  }, [currentPage]);

  const getActionIcon = (action) => {
    const icons = {
      CREATE: <FaPlus color="#27AE60" />,
      UPDATE: <FaEdit color="#F39C12" />,
      DELETE: <FaTrash color="#E74C3C" />,
      LOGIN: <FaSignInAlt color="#3498DB" />,
      SALE: <FaDollarSign color="#27AE60" />,
      PURCHASE: <FaShoppingCart color="#E67E22" />,
    };
    return icons[action] || <FaBox />;
  };

  const getEntityIcon = (entity) => {
    const icons = {
      PRODUCT: <FaBox />,
      SALE: <FaDollarSign />,
      PURCHASE: <FaShoppingCart />,
      USER: <FaUser />,
    };
    return icons[entity] || <FaBox />;
  };

  const getActionLabel = (action) => {
    const labels = {
      CREATE: 'إضافة',
      UPDATE: 'تعديل',
      DELETE: 'حذف',
      LOGIN: 'تسجيل دخول',
      SALE: 'بيع',
      PURCHASE: 'شراء',
    };
    return labels[action] || action;
  };

  const getEntityLabel = (entity) => {
    const labels = {
      PRODUCT: 'منتج',
      SALE: 'فاتورة بيع',
      PURCHASE: 'فاتورة شراء',
      USER: 'مستخدم',
      REPORT: 'تقرير',
    };
    return labels[entity] || entity;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('ar-EG', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredLogs = activityLogs.filter(log => {
    const matchSearch = log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAction = filterAction ? log.action === filterAction : true;
    const matchEntity = filterEntity ? log.entity === filterEntity : true;
    return matchSearch && matchAction && matchEntity;
  });

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="activity-log fade-in">
      <div className="activity-log-header">
        <div>
          <h2>📋 سجل النشاطات</h2>
          <p className="subtitle">جميع العمليات التي تمت في النظام</p>
        </div>
      </div>

      <Card>
        {/* ✅ شريط البحث والفلترة */}
        <div className="activity-log-filters">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="بحث عن نشاط..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="filter-select"
            >
              <option value="">كل الأحداث</option>
              <option value="CREATE">إضافة</option>
              <option value="UPDATE">تعديل</option>
              <option value="DELETE">حذف</option>
              <option value="LOGIN">تسجيل دخول</option>
              <option value="SALE">بيع</option>
              <option value="PURCHASE">شراء</option>
            </select>

            <select
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              className="filter-select"
            >
              <option value="">كل الكيانات</option>
              <option value="PRODUCT">منتج</option>
              <option value="SALE">فاتورة بيع</option>
              <option value="PURCHASE">فاتورة شراء</option>
              <option value="USER">مستخدم</option>
            </select>
          </div>
        </div>

        {/* ✅ جدول النشاطات */}
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>المستخدم</th>
                <th>الحدث</th>
                <th>الكيان</th>
                <th>التفاصيل</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr key={log._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="user-cell">
                      <span className="username">{log.username}</span>
                      <span className={`role-badge ${log.userRole}`}>
                        {log.userRole === 'super_admin' ? 'سوبر أدمن' : 'أدمن'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="action-badge">
                      {getActionIcon(log.action)}
                      {getActionLabel(log.action)}
                    </span>
                  </td>
                  <td>
                    <span className="entity-badge">
                      {getEntityIcon(log.entity)}
                      {getEntityLabel(log.entity)}
                    </span>
                  </td>
                  <td>
                    <div className="details-cell">
                      <span className="entity-name">{log.entityName}</span>
                      {log.details && (
                        <span className="details-text">{log.details}</span>
                      )}
                    </div>
                  </td>
                  <td className="date-cell">{formatDate(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div className="empty-state">
              <p>لا توجد نشاطات مطابقة للبحث</p>
            </div>
          )}
        </div>

        {/* ✅ Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              السابق
            </Button>
            <span className="page-info">
              صفحة {currentPage} من {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              التالي
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ActivityLog;