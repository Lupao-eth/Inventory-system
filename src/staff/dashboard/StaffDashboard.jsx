import React from 'react';
import { ShoppingCart, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import StatCard from './StatCard';
import Transactions from './Transactions';
import Order from './quick-actions/Order';
import Stock from './quick-actions/Stock';
import AddProduct from './quick-actions/AddProduct';

// Cleaned up props: We no longer need the modal state passed from App.jsx
const StaffDashboard = ({ 
  inventory, 
  setInventory, 
  orders, 
  setOrders 
}) => {

  // 1. Calculations for Stat Cards based on props
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const lowStockItems = inventory.filter(item => item.remaining <= item.threshold);
  
  const handleResetData = () => {
    if(window.confirm("WARNING: This will wipe all vault data and restore factory defaults. Proceed?")) {
      // Clear the specific keys used in main.jsx
      localStorage.removeItem('vault_inventory');
      localStorage.removeItem('tainer_orders');
      
      // Force a reload to let main.jsx re-initialize with sample data
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1717] text-[#EDEBDD] font-['Inter'] relative">
      <main className="p-8 max-w-[1400px] mx-auto">
        <div className="border-b border-[#810100]/30 mb-6 pb-2">
          <DashboardHeader onReset={handleResetData} />
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="TOTAL ORDERS" 
            value={orders.length} 
            icon={<ShoppingCart />} 
          />
          
          <StatCard 
            title="TOTAL REVENUE" 
            value={`₱${totalRevenue.toLocaleString()}`} 
            icon={<span className="font-bold">₱</span>}
            subtitle={(
              <div className="flex items-center gap-1">
                 <TrendingUp size={12} className="text-[#810100]" />
                 <p className="text-[#EDEBDD] text-[10px]">Live Balance</p>
              </div>
            )}
          />

          <StatCard 
            title="INVENTORY ITEMS" 
            value={inventory.length} 
            icon={<Activity />} 
            items={inventory.map(item => ({ name: item.name, qty: item.remaining }))}
          />

          <StatCard 
            title="LOW STOCK ALERT" 
            value={lowStockItems.length} 
            icon={<AlertTriangle />} 
            type="alert" 
            items={lowStockItems.map(item => ({ name: item.name, qty: item.remaining }))}
          />
        </div>

        {/* Main Content Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Side: Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-[#EDEBDD] uppercase text-[10px] font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#810100] rounded-full animate-pulse"></span>
              Quick Actions
            </h3>
            <div className="flex flex-col gap-3">
              <AddProduct setInventory={setInventory} />
              
              {/* NOW SELF-CONTAINED: 
                  We removed isOpen/setIsOpen because the Order component 
                  now manages its own state internally, matching the Products page style. 
              */}
              <Order 
                inventory={inventory} 
                setInventory={setInventory} 
                setOrders={setOrders} 
                variant="card"
              />
              
              <Stock 
                inventory={inventory} 
                setInventory={setInventory} 
              />
            </div>
          </div>

          {/* Right Side: Transaction Logs */}
          <div className="lg:col-span-2">
            <Transactions orders={orders} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;