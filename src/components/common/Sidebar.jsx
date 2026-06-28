import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaBox, 
  FaShoppingCart, 
  FaDollarSign,
  FaChartLine,
  FaBuilding,
  FaUsers,
  FaSignOutAlt,
  FaCrown,
  FaTimes,
  FaHistory
} from 'react-icons/fa';

const Sidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = user.isSuperAdmin;
  const isAdmin = user.isAdmin || isSuperAdmin;

  const menuItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'الرئيسية' },
    { path: '/products', icon: <FaBox />, label: 'المنتجات' },
    { path: '/purchases', icon: <FaShoppingCart />, label: 'المشتريات' },
    { path: '/sales', icon: <FaDollarSign />, label: 'المبيعات' },
    { path: '/reports', icon: <FaChartLine />, label: 'التقارير' },
  ];

  if (isAdmin) {
    menuItems.push({ path: '/activity-logs', icon: <FaHistory />, label: 'سجل النشاطات' });
  }

  if (isSuperAdmin) {
    menuItems.push({ path: '/users', icon: <FaUsers />, label: 'المستخدمين' });
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <>
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onToggle}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <button 
          className="sidebar-close-btn"
          onClick={onToggle}
        >
          <FaTimes />
        </button>

        <div className="sidebar-logo">
          <FaBuilding size={28} color="#E67E22" />
          <span>مواد البناء</span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`
              }
              onClick={() => {
                if (window.innerWidth <= 768) {
                  onToggle();
                }
              }}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <span className="sidebar-user-name">{user.fullName || 'المدير'}</span>
            <span className="sidebar-user-role">
              {isSuperAdmin ? (
                <><FaCrown /> سوبر أدمن</>
              ) : (
                '🛡️ أدمن'
              )}
            </span>
          </div>
          
          <button onClick={handleLogout} className="sidebar-logout">
            <FaSignOutAlt /> تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;