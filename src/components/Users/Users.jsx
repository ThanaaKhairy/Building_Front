import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserPlus, 
  FaEdit, 
  FaTrash, 
  FaUserShield, 
  FaCrown, 
  FaCheck, 
  FaTimes, 
  FaSearch,
  FaSave,
  FaUser
} from 'react-icons/fa';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';

const Users = () => {
  const navigate = useNavigate();
  const { users, fetchUsers, deleteUser, updateUser, currentUser, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    isActive: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ بدء التعديل
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone || '',
      isActive: user.isActive,
    });
  };

  // ✅ حفظ التعديل
  const handleUpdate = async (id) => {
    try {
      await updateUser(id, editForm);
      setEditingUser(null);
      await fetchUsers();
      alert('✅ تم تحديث المستخدم بنجاح');
    } catch (error) {
      alert('❌ فشل تحديث المستخدم: ' + error.message);
    }
  };

  // ✅ إلغاء التعديل
  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  // ✅ حذف مستخدم
  const handleDelete = async (id, username) => {
    if (window.confirm(`⚠️ هل أنت متأكد من حذف الأدمن "${username}"؟`)) {
      try {
        await deleteUser(id);
        await fetchUsers();
        alert('✅ تم حذف المستخدم بنجاح');
      } catch (error) {
        alert('❌ فشل حذف المستخدم: ' + error.message);
      }
    }
  };

  // ✅ تغيير بيانات التعديل
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({
      ...editForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const getRoleBadge = (role) => {
    if (role === 'super_admin') {
      return { 
        label: 'سوبر أدمن', 
        color: '#C0392B', 
        icon: <FaCrown />,
        bgColor: '#FADBD8'
      };
    }
    return { 
      label: 'أدمن', 
      color: '#E67E22', 
      icon: <FaUserShield />,
      bgColor: '#FDEBD0'
    };
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2> إدارة الأدمنز</h2>
          <p style={styles.subtitle}>
            إدارة حسابات الأدمنز في النظام
            <span style={styles.note}>(فقط السوبر أدمن يمكنه إضافة أو حذف أدمن)</span>
          </p>
        </div>
        <Button 
          variant="primary"
          icon={<FaUserPlus />}
          onClick={() => navigate('/users/add')}
        >
          إضافة أدمن جديد
        </Button>
      </div>

      <Card>
        <div style={styles.toolbar}>
          <div style={styles.searchBox}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="بحث عن أدمن..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <span style={styles.count}>
            عدد الأدمنز: {filteredUsers.length}
          </span>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>اسم المستخدم</th>
                <th>الاسم الكامل</th>
                <th>البريد الإلكتروني</th>
                <th>الصلاحية</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => {
                const roleBadge = getRoleBadge(user.role);
                const isCurrentUser = user._id === currentUser?._id;
                const isSuperAdmin = user.role === 'super_admin';
                const isEditing = editingUser === user._id;
                
                return (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    
                    {/* ✅ اسم المستخدم - قابل للتعديل */}
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          name="username"
                          value={editForm.username || ''}
                          onChange={handleEditChange}
                          style={styles.editInput}
                        />
                      ) : (
                        <strong>
                          {user.username}
                          {isCurrentUser && (
                            <span style={styles.currentBadge}> (أنت)</span>
                          )}
                        </strong>
                      )}
                    </td>
                    
                    {/* ✅ الاسم الكامل - قابل للتعديل */}
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          name="fullName"
                          value={editForm.fullName || ''}
                          onChange={handleEditChange}
                          style={styles.editInput}
                        />
                      ) : (
                        user.fullName
                      )}
                    </td>
                    
                    {/* ✅ البريد الإلكتروني - قابل للتعديل */}
                    <td>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editForm.email || ''}
                          onChange={handleEditChange}
                          style={styles.editInput}
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    
                    {/* ✅ الصلاحية - غير قابلة للتعديل */}
                    <td>
                      <span style={{
                        ...styles.roleBadge,
                        backgroundColor: roleBadge.bgColor,
                        color: roleBadge.color
                      }}>
                        {roleBadge.icon} {roleBadge.label}
                      </span>
                    </td>
                    
                    {/* ✅ الحالة - قابلة للتعديل */}
                    <td>
                      {isEditing ? (
                        <label style={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            name="isActive"
                            checked={editForm.isActive}
                            onChange={handleEditChange}
                          />
                          {editForm.isActive ? 'نشط' : 'غير نشط'}
                        </label>
                      ) : (
                        user.isActive ? (
                          <span style={styles.activeBadge}>
                            <FaCheck /> نشط
                          </span>
                        ) : (
                          <span style={styles.inactiveBadge}>
                            <FaTimes /> غير نشط
                          </span>
                        )
                      )}
                    </td>
                    
                    {/* ✅ الإجراءات */}
                    <td>
                      {isEditing ? (
                        <div style={styles.actions}>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleUpdate(user._id)}
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
                            onClick={() => handleEdit(user)}
                            disabled={isSuperAdmin}
                            title={isSuperAdmin ? 'لا يمكن تعديل السوبر أدمن' : 'تعديل'}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(user._id, user.username)}
                            disabled={isSuperAdmin || isCurrentUser}
                            title={
                              isSuperAdmin ? 'لا يمكن حذف السوبر أدمن' :
                              isCurrentUser ? 'لا يمكن حذف نفسك' : 'حذف'
                            }
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
          {filteredUsers.length === 0 && (
            <div style={styles.empty}>
              <p>لا يوجد أدمنز مطابقين للبحث</p>
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
    alignItems: 'flex-start',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  subtitle: {
    color: '#7F8C8D',
    marginTop: '4px',
  },
  note: {
    display: 'block',
    fontSize: '0.8rem',
    color: '#E67E22',
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
  editInput: {
    padding: '4px 8px',
    border: '2px solid #C0392B',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontFamily: "'Cairo', sans-serif",
    width: '100%',
    minWidth: '80px',
    background: '#fff',
  },
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: '20px',
    fontWeight: 600,
    fontSize: '0.8rem',
  },
  currentBadge: {
    fontSize: '0.75rem',
    color: '#27AE60',
    fontWeight: 600,
  },
  activeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    color: '#27AE60',
    fontWeight: 600,
    fontSize: '0.85rem',
  },
  inactiveBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    color: '#E74C3C',
    fontWeight: 600,
    fontSize: '0.85rem',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  actions: {
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

export default Users;