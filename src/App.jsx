import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import Products from './components/Products/Products';
import AddProduct from './components/Products/AddProduct';
import Purchases from './components/Purchases/Purchases';
import AddPurchase from './components/Purchases/AddPurchase';
import Sales from './components/Sales/Sales';
import AddSale from './components/Sales/AddSale';
import Reports from './components/Reports/Reports';
import ActivityLog from './components/ActivityLog/ActivityLog'; // ✅ استيراد صفحة سجل النشاطات
import Users from './components/Users/Users';
import AddUser from './components/Users/AddUser';
import './styles/global.css';

function App() {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  
  // ✅ حالة الـ Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isAuthenticated) {
    return (
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AppProvider>
    );
  }

  return (
    <AppProvider>
      <Router>
        <div className="app-container">
          {/* ✅ Sidebar مع isOpen */}
          <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
          
          <div className="main-content">
            {/* ✅ Navbar مع زر Toggle */}
            <Navbar onToggleSidebar={toggleSidebar} />
            
            <Routes>
              <Route path="/login" element={<Navigate to="/dashboard" />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/products" element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              } />
              <Route path="/products/add" element={
                <ProtectedRoute>
                  <AddProduct />
                </ProtectedRoute>
              } />
              <Route path="/purchases" element={
                <ProtectedRoute>
                  <Purchases />
                </ProtectedRoute>
              } />
              <Route path="/purchases/add" element={
                <ProtectedRoute>
                  <AddPurchase />
                </ProtectedRoute>
              } />
              <Route path="/sales" element={
                <ProtectedRoute>
                  <Sales />
                </ProtectedRoute>
              } />
              <Route path="/sales/add" element={
                <ProtectedRoute>
                  <AddSale />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />
              
              {/* ✅ Route لسجل النشاطات (لجميع الأدمنز) */}
              <Route path="/activity-logs" element={
                <ProtectedRoute>
                  <ActivityLog />
                </ProtectedRoute>
              } />
              
              <Route path="/users" element={
                <ProtectedRoute requireSuperAdmin>
                  <Users />
                </ProtectedRoute>
              } />
              <Route path="/users/add" element={
                <ProtectedRoute requireSuperAdmin>
                  <AddUser />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;