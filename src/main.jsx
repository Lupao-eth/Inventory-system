import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

// Auth
import Login from "./login/Login";

// Staff Components
import StaffDashboard from "./staff/dashboard/StaffDashboard";
import Products from "./staff/products/Products";
import Orders from "./staff/orders/orders"; 
import Navbar from "./staff/navbar"; 

// Admin Components
import AdminDashboard from "./admin/dashboard/AdminDashboard";
import AdminProducts from "./admin/products/AdminProducts";
import AdminOrders from "./admin/orders/AdminOrders";

import './index.css';

// Layout Wrapper to prevent double navbars
const DashboardLayout = ({ isAdmin }) => {
  return (
    <>
      <Navbar isAdmin={isAdmin} />
      <Outlet /> 
    </>
  );
};

const App = () => {
  // 1. Shared Inventory State
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('vault_inventory');
    return saved ? JSON.parse(saved) : [
      { name: 'Tactical Gear v2', remaining: 12, price: 1250, threshold: 5 },
      { name: 'Armor Plating', remaining: 3, price: 3000, threshold: 5 },
      { name: 'Comm Unit', remaining: 25, price: 800, threshold: 10 },
    ];
  });

  // 2. Shared Orders State
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('tainer_orders');
    return saved ? JSON.parse(saved) : [
      { id: "ORD-9901", item: "Tactical Gear v2", total: 1200, status: "Completed", date: "2024-03-24" },
    ];
  });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('vault_inventory', JSON.stringify(inventory));
    localStorage.setItem('tainer_orders', JSON.stringify(orders));
  }, [inventory, orders]);

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />
      
      {/* Staff & Common Protected Routes */}
      <Route element={<DashboardLayout isAdmin={false} />}>
        <Route 
          path="/dashboard" 
          element={
            <StaffDashboard 
              inventory={inventory} 
              setInventory={setInventory} 
              orders={orders} 
              setOrders={setOrders} 
              // We removed the modal states here as the Order component now manages itself
            />
          } 
        />
        <Route 
          path="/products" 
          element={
            <Products 
              inventory={inventory} 
              setInventory={setInventory} 
            />
          } 
        />
        <Route 
          path="/orders" 
          element={
            <Orders 
              orders={orders} 
              setOrders={setOrders} 
              inventory={inventory} 
              setInventory={setInventory}
            />
          } 
        />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<DashboardLayout isAdmin={true} />}>
        <Route 
          path="/admin" 
          element={
            <AdminDashboard 
              inventory={inventory} 
              setInventory={setInventory} 
              orders={orders} 
              setOrders={setOrders} 
            />
          } 
        />
        <Route 
          path="/admin/products" 
          element={
            <AdminProducts 
              inventory={inventory} 
              setInventory={setInventory} 
            />
          } 
        />
        <Route 
          path="/admin/orders" 
          element={
            <AdminOrders 
              orders={orders} 
              setOrders={setOrders} 
              inventory={inventory} 
              setInventory={setInventory}
            />
          } 
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Application Bootloader
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

export default App;