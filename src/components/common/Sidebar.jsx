import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaBox, 
  FaShoppingCart, 
  FaDollarSign,
  FaChartLine,
  FaCog,
  FaBuilding,
  FaUsers,
  FaSignOutAlt,
  FaCrown,
  FaTimes,
  FaHistory  // ✅ أيقونة سجل النشاطات
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

  // ✅ إضافة سجل النشاطات (لجميع الأدمنز)
  if (isAdmin) {
    menuItems.push({ path: '/activity-logs', icon: <FaHistory />, label: 'سجل النشاطات' });
  }

  // ✅ إضافة المستخدمين (للسوبر أدمن فقط)
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
      {/* ✅ Overlay للـ Mobile */}
      {isOpen && (
        <div 
          style={styles.overlay}
          onClick={onToggle}
        />
      )}

      <aside style={{
        ...styles.sidebar,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      }}>
        {/* ✅ زر الإغلاق */}
        <button 
          style={styles.closeBtn}
          onClick={onToggle}
        >
          <FaTimes />
        </button>

        <div style={styles.logo}>
          <FaBuilding size={28} color="#E67E22" />
          <span style={styles.logoText}>مواد البناء</span>
        </div>

        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
              onClick={() => {
                // غلق الـ Sidebar بعد الضغط على رابط (في الموبايل)
                if (window.innerWidth <= 768) {
                  onToggle();
                }
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={styles.bottom}>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{user.fullName || 'المدير'}</span>
            <span style={styles.userRole}>
              {isSuperAdmin ? (
                <><FaCrown style={{ marginLeft: '4px' }} /> سوبر أدمن</>
              ) : (
                '🛡️ أدمن'
              )}
            </span>
          </div>
          
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <FaSignOutAlt /> تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 999,
    animation: 'fadeIn 0.3s ease',
  },
  sidebar: {
    position: 'fixed',
    right: 0,
    top: 0,
    height: '100vh',
    width: '280px',
    background: 'linear-gradient(180deg, #2C3E50 0%, #1A252F 100%)',
    color: '#fff',
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-2px 0 12px rgba(0,0,0,0.2)',
    zIndex: 1000,
    overflowY: 'auto',
    transition: 'transform 0.3s ease',
    transform: 'translateX(100%)', // hidden by default
  },
  closeBtn: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#fff',
    fontSize: '1.2rem',
    padding: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'none',
    transition: 'all 0.3s ease',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 20px',
    marginBottom: '30px',
    marginTop: '10px',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#fff',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '0 12px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    color: '#BDC3C7',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  navItemActive: {
    background: 'rgba(192, 57, 43, 0.3)',
    color: '#fff',
    borderRight: '3px solid #C0392B',
  },
  navIcon: {
    fontSize: '1.1rem',
    width: '24px',
    textAlign: 'center',
  },
  bottom: {
    padding: '0 12px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '20px',
    marginTop: '20px',
  },
  userInfo: {
    padding: '12px 16px',
    marginBottom: '12px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
  },
  userName: {
    display: 'block',
    fontWeight: 700,
    fontSize: '0.95rem',
    color: '#fff',
  },
  userRole: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.75rem',
    color: '#E67E22',
    marginTop: '2px',
  },
  logoutBtn: {
    width: '100%',
    padding: '10px 16px',
    background: 'rgba(231, 76, 60, 0.2)',
    color: '#E74C3C',
    border: '1px solid rgba(231, 76, 60, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "'Cairo', sans-serif",
    fontSize: '0.9rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
  },
};

// ✅ CSS للـ fadeIn animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);

export default Sidebar;