import React, { useState } from 'react';
import { Search, Filter, ShoppingCart, Clock, XCircle, FileDown, MoreHorizontal, ShieldAlert, X } from 'lucide-react';
// Importing the Modal to use it as a self-contained button
import OrderModal from '../dashboard/quick-actions/Order';

const Orders = ({ orders = [], setOrders, inventory, setInventory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRestrictedModalOpen, setIsRestrictedModalOpen] = useState(false);

  // Handle Unauthorized Action for Three Dots
  const handleActionClick = () => {
    setIsRestrictedModalOpen(true);
  };

  // Filter Logic
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const completedCount = orders.filter(o => o.status === 'Completed').length;

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Completed': 
        return 'text-[#EDEBDD] border-transparent bg-transparent p-0'; 
      case 'Pending': 
        return 'text-[#EDEBDD] bg-[#810100]/10 border-[#810100]/20 px-3 py-1 rounded-full border';
      case 'Cancelled': 
        return 'text-[#EDEBDD] bg-[#810100]/10 border-[#810100]/20 px-3 py-1 rounded-full border';
      default: 
        return 'text-[#EDEBDD] bg-white/5 border-white/10 px-3 py-1 rounded-full border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return null; 
      case 'Pending': return <Clock size={14} />;
      case 'Cancelled': return <XCircle size={14} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1717] p-4 md:p-8 font-['Inter'] text-[#EDEBDD]">
      
      {/* Custom Tactical Animations */}
      <style>{`
        @keyframes tactical-shake {
          0% { transform: translate(0,0) scale(1); }
          10% { transform: translate(-2px, -2px); }
          20% { transform: translate(2px, 2px); }
          30% { transform: translate(-2px, 2px); }
          40% { transform: translate(2px, -2px); }
          50% { transform: scale(1.02); border-color: #ff0000; }
          100% { transform: translate(0,0) scale(1); }
        }
        .animate-urgent {
          animation: tactical-shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        .red-alert-glow {
          box-shadow: 0 0 20px rgba(129, 1, 0, 0.6), inset 0 0 15px rgba(129, 1, 0, 0.4);
        }
      `}</style>

      {/* 1. RESTRICTED ACTION MODAL */}
      {isRestrictedModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsRestrictedModalOpen(false)}></div>
          
          <div className="relative bg-[#1B1717] border-2 border-[#810100] p-8 max-w-md w-full rounded animate-urgent red-alert-glow">
            {/* Top Warning Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#810100] animate-pulse"></div>
            
            <button 
              onClick={() => setIsRestrictedModalOpen(false)}
              className="absolute top-4 right-4 text-[#EDEBDD]/20 hover:text-[#810100] transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#810100]/20 rounded-full flex items-center justify-center mb-6 border-2 border-[#810100] animate-pulse">
                <ShieldAlert size={40} className="text-[#810100]" />
              </div>
              
              <h2 className="text-[#810100] font-black uppercase text-2xl mb-2 ">System Restricted</h2>
              <div className="h-[1px] w-12 bg-[#810100] mb-4"></div>
              
              <p className="text-[#EDEBDD] text-xs font-black leading-relaxed uppercase  opacity-90">
                UNAUTHORIZED: ACTION RESTRICTED TO ADMINS ONLY. <br/>
                PLEASE SWITCH TO ADMIN MODE TO MODIFY RECORDS.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-6 bg-[#810100]"></div>
            <h1 className="text-2xl md:text-3xl font-black uppercase ">Orders</h1>
          </div>
          <p className="text-[#EDEBDD]/40 text-[10px] uppercase font-bold ml-5">Order History</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#810100]" size={16} />
            <input 
              type="text"
              placeholder="SEARCH ORDER ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/40 border border-[#810100]/30 rounded px-10 py-2.5 text-xs outline-none focus:border-[#810100] transition-all w-full lg:w-64 uppercase "
            />
          </div>

          <OrderModal 
            inventory={inventory} 
            setInventory={setInventory} 
            setOrders={setOrders} 
            variant="button" 
          />

          <button className="flex items-center gap-2 bg-red-700 border border-red-600 px-4 py-2.5 rounded text-[10px] font-black uppercase hover:bg-red-600 transition-all cursor-pointer h-[38px]">
            <FileDown size={16} className="text-[#810100]" /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 border border-[#810100]/40 p-6 rounded relative overflow-hidden">
          <p className="text-[10px] uppercase font-black mb-2" style={{ color: '#EDEBDD' }}>
            Total Gross Volume
          </p>
          <p className="text-3xl font-black text-[#EDEBDD]">₱{totalRevenue.toLocaleString()}</p>
          <ShoppingCart className="absolute -right-4 -bottom-4 opacity-[0.03]" size={80} />
        </div>
        
        <div className="bg-white/5 border border-[#810100]/40 p-6 rounded relative">
          <p className="text-[10px] uppercase font-black mb-2" style={{ color: '#EDEBDD' }}>
            Pending Fulfillment
          </p>
          <p className="text-3xl font-black text-[#EDEBDD]">{pendingCount}</p>
        </div>
        
        <div className="bg-white/5 border border-[#810100]/40 p-6 rounded relative">
          <p className="text-[10px] uppercase font-black mb-2" style={{ color: '#EDEBDD' }}>
            Total Completed
          </p>
          <p className="text-3xl font-black text-[#EDEBDD]">{completedCount}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white/5 border border-[#810100]/40 rounded-md overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 border-b border-[#810100]/30">
                <th className="p-4 text-[10px] uppercase font-black text-[#EDEBDD]">Order ID</th>
                <th className="p-4 text-[10px] uppercase font-black text-[#EDEBDD]">Designation</th>
                <th className="p-4 text-[10px] uppercase font-black text-[#EDEBDD]">Date</th>
                <th className="p-4 text-[10px] uppercase font-black text-[#EDEBDD]">Total Value</th>
                <th className="p-4 text-[10px] uppercase font-black text-[#EDEBDD]">Status</th>
                <th className="p-4 text-[10px] uppercase font-black text-[#EDEBDD] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#810100]/10">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 font-mono text-xs font-bold text-[#EDEBDD]">{order.id}</td>
                    <td className="p-4">
                      <p className="text-xs font-black uppercase group-hover:text-[#810100] transition-colors text-[#EDEBDD]">{order.item}</p>
                    </td>
                    <td className="p-4 text-[10px] font-bold opacity-40 uppercase text-[#EDEBDD]">{order.date}</td>
                    <td className="p-4 font-mono text-xs font-black text-[#EDEBDD]">₱{order.total.toLocaleString()}</td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-2 text-[9px] font-black uppercase transition-all ${getStatusStyles(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={handleActionClick}
                        className="text-[#EDEBDD]/20 hover:text-[#810100] transition-colors cursor-pointer p-1"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-20 text-center">
                    <p className="text-[10px] uppercase opacity-20 font-black text-[#EDEBDD]">No Transaction Records Found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;