import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { authService } from './services/auth.service';
import Navbar from './components/Layout/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Credit from './pages/Credit';
import Debit from './pages/Debit';
import Transfer from './pages/Transfer';
import TransactionHistory from './pages/TransactionHistory';
import Profile from './pages/Profile';
import AdminUsers from './pages/AdminUsers';
import AdminTransactions from './pages/AdminTransactions';
import AdminFraud from './pages/AdminFraud';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return authService.isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return authService.isAuthenticated() && authService.isAdmin() ? (
    <>{children}</>
  ) : (
    <Navigate to="/dashboard" />
  );
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/credit" element={<Credit />} />
                  <Route path="/debit" element={<Debit />} />
                  <Route path="/transfer" element={<Transfer />} />
                  <Route path="/transactions" element={<TransactionHistory />} />
                  <Route
                    path="/admin/users"
                    element={
                      <AdminRoute>
                        <AdminUsers />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/transactions"
                    element={
                      <AdminRoute>
                        <AdminTransactions />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/fraud"
                    element={
                      <AdminRoute>
                        <AdminFraud />
                      </AdminRoute>
                    }
                  />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
              </>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;