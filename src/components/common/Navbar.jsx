import React from 'react';
import { FaBell, FaSearch, FaBars } from 'react-icons/fa';

const Navbar = ({ onToggleSidebar }) => {
  return (
    <header style={styles.navbar}>
      <div style={styles.left}>
        {/* ✅ زر Toggle الـ Sidebar */}
        <button 
          style={styles.menuBtn}
          onClick={onToggleSidebar}
        >
          <FaBars />
        </button>
        {/* <div style={styles.searchBox}>
          <FaSearch style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="بحث عن منتج..." 
            style={styles.searchInput}
          />
        </div> */}
      </div>

      {/* <div style={styles.right}>
        <div style={styles.notificationWrapper}>
          <FaBell style={styles.notificationIcon} />
          <span style={styles.notificationBadge}>0</span>
        </div>
      </div> */}
    </header>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    background: '#fff',
    borderRadius: '12px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.3rem',
    cursor: 'pointer',
    color: '#2C3E50',
    padding: '8px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  notificationWrapper: {
    position: 'relative',
    cursor: 'pointer',
  },
  notificationIcon: {
    fontSize: '1.3rem',
    color: '#7F8C8D',
    transition: 'color 0.3s',
  },
  notificationBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    background: '#E74C3C',
    color: '#fff',
    fontSize: '0.65rem',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
  },
};

export default Navbar;