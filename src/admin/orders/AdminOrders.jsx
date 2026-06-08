import React, { useState } from 'react';
import { Search, Plus, Trash2, X } from 'lucide-react';

const AdminOrders = ({ orders = [], setOrders, inventory = [], setInventory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [addModal, setAddModal] = useState(false);
  const [newOrder, setNewOrder] = useState({ item: '', qty: '', customer: '' });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.item.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || filterStatus === order.status.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  // Stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const completedCount = orders.filter(o => o.status === 'Completed').length;
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

  // Add Order Handler
  const handleAddOrder = () => {
    if (!newOrder.item || !newOrder.qty || !newOrder.customer) {
      alert('All fields required');
      return;
    }

    const product = inventory.find(p => p.name === newOrder.item);
    if (!product) {
      alert('Product not found');
      return;
    }

    const qty = Number(newOrder.qty);
    if (product.remaining < qty) {
      alert(`Insufficient stock! Only ${product.remaining} units available.`);
      return;
    }

    const orderTotal = product.price * qty;
    const newOrderRecord = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      item: newOrder.item,
      total: orderTotal,
      customer: newOrder.customer,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };

    setOrders([newOrderRecord, ...orders]);
    
    // Deduct from inventory
    setInventory(inventory.map(item =>
      item.name === newOrder.item
        ? { ...item, remaining: item.remaining - qty }
        : item
    ));

    setNewOrder({ item: '', qty: '', customer: '' });
    setAddModal(false);
  };

  // Change Order Status
  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Delete Order Handler
  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`Delete order ${orderId}?`)) {
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1717] p-4 md:p-8 font-['Inter'] text-[#EDEBDD]">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .btn-interactive {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-interactive:hover {
          transform: scale(1.02);
        }
        
        .btn-interactive:active {
          transform: scale(0.98);
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          border-color: #810100;
        }
      `}</style>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 bg-[#810100] shrink-0" />
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase text-[#EDEBDD]">Orders</h1>
            <p className="text-[#EDEBDD]/50 text-[9px] uppercase font-bold mt-1">Manage & Track</p>
          </div>
        </div>
        <button
          onClick={() => setAddModal(true)}
          className="bg-[#810100] hover:bg-[#a10100] text-[#EDEBDD] text-[10px] font-bold uppercase px-4 py-3 rounded flex items-center justify-center gap-2 transition-all btn-interactive whitespace-nowrap"
        >
          <Plus size={16} /> New Order
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 border-2 border-[#810100]/40 p-5 rounded-lg hover-lift group animate-fade-in" style={{animationDelay: '0.1s'}}>
          <h3 className="text-[9px] uppercase tracking-wider opacity-50 mb-3">Total Revenue</h3>
          <p className="text-2xl md:text-3xl font-black text-[#EDEBDD]">₱{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border-2 border-[#810100]/40 p-5 rounded-lg hover-lift group animate-fade-in" style={{animationDelay: '0.15s'}}>
          <h3 className="text-[9px] uppercase tracking-wider opacity-50 mb-3">Completed</h3>
          <p className="text-2xl md:text-3xl font-black text-[#EDEBDD]">{completedCount}</p>
        </div>
        <div className="bg-white/5 border-2 border-[#810100]/40 p-5 rounded-lg hover-lift group animate-fade-in" style={{animationDelay: '0.2s'}}>
          <h3 className="text-[9px] uppercase tracking-wider opacity-50 mb-3">Pending</h3>
          <p className="text-2xl md:text-3xl font-black text-[#EDEBDD]">{pendingCount}</p>
        </div>
        <div className="bg-white/5 border-2 border-[#810100]/40 p-5 rounded-lg hover-lift group animate-fade-in" style={{animationDelay: '0.25s'}}>
          <h3 className="text-[9px] uppercase tracking-wider opacity-50 mb-3">Cancelled</h3>
          <p className="text-2xl md:text-3xl font-black text-[#EDEBDD]">{cancelledCount}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#810100]" size={16} />
          <input
            type="text"
            placeholder="Search by order ID or item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-[#810100]/20 pl-10 pr-4 py-3 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all rounded"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white/5 border border-[#810100]/20 px-4 py-3 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all rounded cursor-pointer"
        >
          <option value="all">All Orders</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white/5 border border-[#810100]/40 rounded-lg overflow-hidden hover-lift animate-fade-in" style={{animationDelay: '0.35s'}}>
        <div className="overflow-x-auto">
          <table className="w-full text-[9px]">
            <thead className="bg-black/40 border-b border-[#810100]/20">
              <tr>
                <th className="text-left p-3 md:p-4 text-[#810100] font-bold uppercase">Order ID</th>
                <th className="text-left p-3 md:p-4 text-[#810100] font-bold uppercase">Item</th>
                <th className="text-left p-3 md:p-4 text-[#810100] font-bold uppercase">Customer</th>
                <th className="text-left p-3 md:p-4 text-[#810100] font-bold uppercase">Total</th>
                <th className="text-left p-3 md:p-4 text-[#810100] font-bold uppercase">Date</th>
                <th className="text-left p-3 md:p-4 text-[#810100] font-bold uppercase">Status</th>
                <th className="text-center p-3 md:p-4 text-[#810100] font-bold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order.id} className="border-b border-[#810100]/10 hover:bg-[#810100]/5 transition-colors">
                    <td className="p-3 md:p-4 text-[#EDEBDD] font-medium">{order.id}</td>
                    <td className="p-3 md:p-4 text-[#EDEBDD]">{order.item}</td>
                    <td className="p-3 md:p-4 text-[#EDEBDD]">{order.customer || '-'}</td>
                    <td className="p-3 md:p-4 text-[#EDEBDD] font-medium">₱{order.total.toLocaleString()}</td>
                    <td className="p-3 md:p-4 text-[#EDEBDD]/60">{order.date}</td>
                    <td className="p-3 md:p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-black/50 border border-[#810100]/40 text-[#EDEBDD] text-[8px] font-bold uppercase px-2 py-1 rounded cursor-pointer hover:border-[#810100] transition-all"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3 md:p-4 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="bg-red-600/30 hover:bg-red-600/60 p-2 rounded transition-all btn-interactive"
                        title="Delete"
                      >
                        <Trash2 size={13} className="text-[#EDEBDD]" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-[#EDEBDD]/40 text-[10px] uppercase">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Order Modal */}
      {addModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setAddModal(false)}></div>
          
          <div className="relative bg-[#1B1717] border-2 border-[#810100] w-full max-w-md p-8 rounded-lg shadow-[0_0_50px_rgba(129,1,0,0.3)] animate-fade-in">
            <button 
              onClick={() => setAddModal(false)}
              className="absolute top-4 right-4 text-[#EDEBDD]/40 hover:text-[#EDEBDD] transition-colors btn-interactive"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h2 className="text-[#EDEBDD] uppercase font-bold text-lg">New Order</h2>
              <div className="h-1 w-12 bg-[#810100] mt-3"></div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[9px] uppercase text-[#810100] font-bold mb-2 block">Product</label>
                <select
                  value={newOrder.item}
                  onChange={(e) => setNewOrder({ ...newOrder, item: e.target.value })}
                  className="w-full bg-white/5 border border-[#810100]/20 p-3 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all rounded cursor-pointer"
                >
                  <option value="">-- Select --</option>
                  {inventory.map(product => (
                    <option key={product.name} value={product.name}>
                      {product.name} ({product.remaining} available)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[9px] uppercase text-[#810100] font-bold mb-2 block">Quantity</label>
                <input
                  type="number"
                  value={newOrder.qty}
                  onChange={(e) => setNewOrder({ ...newOrder, qty: e.target.value })}
                  placeholder="Units"
                  className="w-full bg-white/5 border border-[#810100]/20 p-3 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all rounded"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase text-[#810100] font-bold mb-2 block">Customer Name</label>
                <input
                  type="text"
                  value={newOrder.customer}
                  onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
                  placeholder="e.g., John Doe"
                  className="w-full bg-white/5 border border-[#810100]/20 p-3 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all rounded"
                />
              </div>

              {newOrder.item && newOrder.qty && (
                <div className="bg-[#810100]/10 border border-[#810100]/40 p-3 rounded">
                  <p className="text-[9px] text-[#EDEBDD]/70">Estimated Total:</p>
                  <p className="text-[14px] font-bold text-[#EDEBDD]">
                    ₱{(
                      Number(newOrder.qty) * 
                      (inventory.find(p => p.name === newOrder.item)?.price || 0)
                    ).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setAddModal(false)}
                className="flex-1 bg-white/5 border border-[#810100]/40 text-[#EDEBDD] px-4 py-3 rounded text-[10px] font-bold uppercase hover:bg-white/10 transition-all btn-interactive"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrder}
                className="flex-1 bg-[#810100] text-[#EDEBDD] px-4 py-3 rounded text-[10px] font-bold uppercase hover:bg-[#a10100] transition-all btn-interactive"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
