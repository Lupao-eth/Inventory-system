import React, { useState } from 'react';
import { TrendingUp, Package, ShoppingCart, AlertTriangle, MoreHorizontal, Trash2, Edit2, X } from 'lucide-react';

const AdminDashboard = ({ inventory = [], setInventory, orders = [], setOrders }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editModal, setEditModal] = useState({ show: false, data: null });

  // Calculations
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const totalProducts = inventory.length;
  const lowStockItems = inventory.filter(item => item.remaining <= item.threshold);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  // Handle Product Delete
  const handleDeleteProduct = (productName) => {
    if (window.confirm(`Delete "${productName}"?`)) {
      setInventory(inventory.filter(item => item.name !== productName));
    }
  };

  // Handle Product Edit
  const handleEditProduct = (product) => {
    setEditModal({ show: true, data: { ...product, originalName: product.name } });
  };

  // Save Product Edit
  const handleSaveEdit = () => {
    if (!editModal.data.name || !editModal.data.price || !editModal.data.remaining) {
      alert('All fields required');
      return;
    }
    setInventory(inventory.map(item =>
      item.name === editModal.data.originalName 
        ? { ...editModal.data, originalName: undefined }
        : item
    ));
    setEditModal({ show: false, data: null });
  };

  // Handle Order Status Change
  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Handle Order Delete
  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`Delete order ${orderId}?`)) {
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1717] text-[#EDEBDD] font-['Inter']">
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
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          border-color: #810100;
        }
        
        .btn-interactive {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .btn-interactive:hover {
          transform: scale(1.02);
        }
        
        .btn-interactive:active {
          transform: scale(0.98);
        }
      `}</style>

      <main className="p-4 md:p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="border-b border-[#810100]/30 mb-8 pb-6 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-black uppercase text-[#EDEBDD]">
            Command Center
          </h1>
          <p className="text-[#EDEBDD]/50 text-[10px] uppercase font-bold mt-2">
            System Administration & Analytics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 border-2 border-[#810100]/40 p-5 rounded-lg hover-lift group animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-[10px] uppercase tracking-wider opacity-50">Total Revenue</h3>
              <TrendingUp size={16} className="text-[#810100] opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl md:text-3xl font-black text-[#EDEBDD]">₱{totalRevenue.toLocaleString()}</p>
            <p className="text-[9px] text-[#EDEBDD]/40 mt-2 uppercase">From {totalOrders} orders</p>
          </div>

        <div className="bg-white/5 border-2 border-[#810100]/40 p-5 rounded-lg hover-lift group animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-[10px] uppercase tracking-wider opacity-50">Products</h3>
              <Package size={16} className="text-[#810100] opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl md:text-3xl font-black text-[#EDEBDD]">{totalProducts}</p>
            <p className="text-[9px] text-[#EDEBDD]/40 mt-2 uppercase">{lowStockItems.length} alert{lowStockItems.length !== 1 ? 's' : ''}</p>
          </div>

          <div className="bg-white/5 border-2 border-[#810100]/40 p-5 rounded-lg hover-lift group animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-[10px] uppercase tracking-wider opacity-50">Orders Complete</h3>
              <ShoppingCart size={16} className="text-[#810100] opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl md:text-3xl font-black text-[#EDEBDD]">{completedOrders}/{totalOrders}</p>
            <p className="text-[9px] text-[#EDEBDD]/40 mt-2 uppercase">{pendingOrders} pending</p>
          </div>

          <div className="bg-white/5 border-2 border-[#810100]/40 p-5 rounded-lg hover-lift group animate-fade-in" style={{animationDelay: '0.25s'}}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-[10px] uppercase tracking-wider opacity-50">Alerts</h3>
              <AlertTriangle size={16} className="text-[#810100] opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl md:text-3xl font-black text-[#EDEBDD]">{lowStockItems.length}</p>
            <p className="text-[9px] text-[#EDEBDD]/40 mt-2 uppercase">Low stock items</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 border-b border-[#810100]/20 pb-4 animate-slide-in">
          {['overview', 'products', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[10px] font-bold uppercase px-4 py-2 rounded transition-all btn-interactive ${
                activeTab === tab
                  ? 'bg-[#810100] text-[#EDEBDD]'
                  : 'text-[#EDEBDD]/50 hover:text-[#EDEBDD] border border-[#810100]/20'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fade-in">
            {lowStockItems.length > 0 && (
              <div className="bg-[#810100]/10 border-2 border-[#810100]/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle size={18} className="text-[#810100]" />
                  <h3 className="text-[11px] font-bold uppercase text-[#EDEBDD]">Stock Alerts</h3>
                </div>
                <div className="space-y-2">
                  {lowStockItems.map((item, idx) => (
                    <div key={item.name} className="flex justify-between items-center text-[10px] bg-black/30 p-3 rounded border border-[#810100]/20 hover:border-[#810100]/40 transition-all" style={{animationDelay: `${idx * 50}ms`}}>
                      <span className="text-[#EDEBDD] font-medium">{item.name}</span>
                      <span className="text-[#EDEBDD]/60 font-bold">{item.remaining} units</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders */}
            <div>
              <h3 className="text-[11px] font-bold uppercase text-[#EDEBDD] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#810100] rounded-full animate-pulse"></span>
                Recent Orders
              </h3>
              <div className="bg-white/5 border border-[#810100]/40 rounded-lg overflow-hidden hover-lift">
                <div className="overflow-x-auto">
                  <table className="w-full text-[9px]">
                    <thead className="bg-black/40 border-b border-[#810100]/20">
                      <tr>
                        <th className="text-left p-3 md:p-4 text-[#810100] font-bold">ORDER ID</th>
                        <th className="text-left p-3 md:p-4 text-[#810100] font-bold">ITEM</th>
                        <th className="text-left p-3 md:p-4 text-[#810100] font-bold">AMOUNT</th>
                        <th className="text-left p-3 md:p-4 text-[#810100] font-bold">STATUS</th>
                        <th className="text-left p-3 md:p-4 text-[#810100] font-bold">DATE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order, idx) => (
                        <tr key={order.id} className="border-b border-[#810100]/10 hover:bg-[#810100]/5 transition-colors" style={{animationDelay: `${idx * 30}ms`}}>
                          <td className="p-3 md:p-4 text-[#EDEBDD] font-bold">{order.id}</td>
                          <td className="p-3 md:p-4 text-[#EDEBDD]">{order.item}</td>
                          <td className="p-3 md:p-4 text-[#EDEBDD] font-medium">₱{order.total.toLocaleString()}</td>
                          <td className="p-3 md:p-4">
                            <span className="text-[8px] font-bold uppercase px-2 py-1 rounded bg-[#810100]/20 text-[#EDEBDD]">
                              {order.status}
                            </span>
                          </td>
                          <td className="p-3 md:p-4 text-[#EDEBDD]/60">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="animate-fade-in">
            <h3 className="text-[11px] font-bold uppercase text-[#EDEBDD] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#810100] rounded-full animate-pulse"></span>
              Inventory Management
            </h3>
            <div className="bg-white/5 border border-[#810100]/40 rounded-lg overflow-hidden hover-lift">
              <div className="overflow-x-auto">
                <table className="w-full text-[9px]">
                  <thead className="bg-black/40 border-b border-[#810100]/20">
                    <tr>
                      <th className="text-left p-3 md:p-4 text-[#810100] font-bold">PRODUCT</th>
                      <th className="text-left p-3 md:p-4 text-[#810100] font-bold">STOCK</th>
                      <th className="text-left p-3 md:p-4 text-[#810100] font-bold">THRESHOLD</th>
                      <th className="text-left p-3 md:p-4 text-[#810100] font-bold">PRICE</th>
                      <th className="text-left p-3 md:p-4 text-[#810100] font-bold">STATUS</th>
                      <th className="text-center p-3 md:p-4 text-[#810100] font-bold">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((product) => (
                      <tr key={product.name} className="border-b border-[#810100]/10 hover:bg-[#810100]/5 transition-colors">
                        <td className="p-3 md:p-4 text-[#EDEBDD] font-medium">{product.name}</td>
                        <td className="p-3 md:p-4 text-[#EDEBDD]">{product.remaining}</td>
                        <td className="p-3 md:p-4 text-[#EDEBDD]">{product.threshold}</td>
                        <td className="p-3 md:p-4 text-[#EDEBDD]">₱{product.price.toLocaleString()}</td>
                        <td className="p-3 md:p-4">
                          <span className={`text-[8px] font-bold uppercase px-2 py-1 rounded bg-[#810100]/20 text-[#EDEBDD]`}>
                            {product.remaining > product.threshold ? 'OK' : 'LOW'}
                          </span>
                        </td>
                        <td className="p-3 md:p-4 flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="bg-[#810100]/30 hover:bg-[#810100]/60 p-2 rounded transition-all btn-interactive"
                            title="Edit"
                          >
                            <Edit2 size={13} className="text-[#EDEBDD]" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.name)}
                            className="bg-red-600/30 hover:bg-red-600/60 p-2 rounded transition-all btn-interactive"
                            title="Delete"
                          >
                            <Trash2 size={13} className="text-[#EDEBDD]" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="animate-fade-in">
            <h3 className="text-[11px] font-bold uppercase text-[#EDEBDD] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#810100] rounded-full animate-pulse"></span>
              Order Management
            </h3>
            <div className="bg-white/5 border border-[#810100]/40 rounded-lg overflow-hidden hover-lift">
              <div className="overflow-x-auto">
                <table className="w-full text-[9px]">
                  <thead className="bg-black/40 border-b border-[#810100]/20">
                    <tr>
                      <th className="text-left p-3 md:p-4 text-[#810100] font-bold">ORDER ID</th>
                      <th className="text-left p-3 md:p-4 text-[#810100] font-bold">ITEM</th>
                      <th className="text-left p-3 md:p-4 text-[#810100] font-bold">TOTAL</th>
                      <th className="text-left p-3 md:p-4 text-[#810100] font-bold">STATUS</th>
                      <th className="text-left p-3 md:p-4 text-[#810100] font-bold">DATE</th>
                      <th className="text-center p-3 md:p-4 text-[#810100] font-bold">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-[#810100]/10 hover:bg-[#810100]/5 transition-colors">
                        <td className="p-3 md:p-4 text-[#EDEBDD] font-bold">{order.id}</td>
                        <td className="p-3 md:p-4 text-[#EDEBDD]">{order.item}</td>
                        <td className="p-3 md:p-4 text-[#EDEBDD]">₱{order.total.toLocaleString()}</td>
                        <td className="p-3 md:p-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="bg-black/50 border border-[#810100]/40 text-[#EDEBDD] text-[9px] font-bold uppercase px-2 py-1 rounded cursor-pointer hover:border-[#810100] transition-all"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3 md:p-4 text-[#EDEBDD]/60">{order.date}</td>
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit Product Modal */}
      {editModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setEditModal({ show: false, data: null })}></div>
          
          <div className="relative bg-[#1B1717] border-2 border-[#810100] w-full max-w-md p-8 rounded-lg shadow-[0_0_50px_rgba(129,1,0,0.3)] animate-fade-in">
            <button 
              onClick={() => setEditModal({ show: false, data: null })}
              className="absolute top-4 right-4 text-[#EDEBDD]/40 hover:text-[#EDEBDD] transition-colors btn-interactive"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h2 className="text-[#EDEBDD] uppercase font-bold text-lg">Update Product</h2>
              <div className="h-1 w-12 bg-[#810100] mt-3"></div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[9px] uppercase text-[#810100] font-bold mb-2 block">Product Name</label>
                <input
                  type="text"
                  value={editModal.data?.name || ''}
                  onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, name: e.target.value } })}
                  className="w-full bg-white/5 border border-[#810100]/20 p-3 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all rounded"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase text-[#810100] font-bold mb-2 block">Price (PHP)</label>
                <input
                  type="number"
                  value={editModal.data?.price || ''}
                  onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, price: Number(e.target.value) } })}
                  className="w-full bg-white/5 border border-[#810100]/20 p-3 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all rounded"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase text-[#810100] font-bold mb-2 block">Stock</label>
                <input
                  type="number"
                  value={editModal.data?.remaining || ''}
                  onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, remaining: Number(e.target.value) } })}
                  className="w-full bg-white/5 border border-[#810100]/20 p-3 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all rounded"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase text-[#810100] font-bold mb-2 block">Threshold</label>
                <input
                  type="number"
                  value={editModal.data?.threshold || ''}
                  onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, threshold: Number(e.target.value) } })}
                  className="w-full bg-white/5 border border-[#810100]/20 p-3 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all rounded"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setEditModal({ show: false, data: null })}
                className="flex-1 bg-white/5 border border-[#810100]/40 text-[#EDEBDD] px-4 py-3 rounded text-[10px] font-bold uppercase hover:bg-white/10 transition-all btn-interactive"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-[#810100] text-[#EDEBDD] px-4 py-3 rounded text-[10px] font-bold uppercase hover:bg-[#a10100] transition-all btn-interactive"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;