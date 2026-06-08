import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';

const AdminProducts = ({ inventory = [], setInventory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState({ show: false, data: null });
  
  // Form States
  const [newProduct, setNewProduct] = useState({ name: '', price: '', remaining: '', threshold: 5 });
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filterStatus === 'all' ? true :
      filterStatus === 'low' ? item.remaining <= item.threshold :
      filterStatus === 'healthy' ? item.remaining > item.threshold : true;
    return matchesSearch && matchesFilter;
  });

  const totalProducts = inventory.length;
  const lowStockCount = inventory.filter(p => p.remaining <= p.threshold).length;
  const healthyCount = totalProducts - lowStockCount;

  // Add Product Handler
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.remaining) {
      alert('All fields required');
      return;
    }

    const productExists = inventory.find(p => p.name.toLowerCase() === newProduct.name.toLowerCase());
    if (productExists) {
      alert('Product already exists');
      return;
    }

    setInventory([...inventory, {
      name: newProduct.name,
      price: Number(newProduct.price),
      remaining: Number(newProduct.remaining),
      threshold: Number(newProduct.threshold)
    }]);

    setNewProduct({ name: '', price: '', remaining: '', threshold: 5 });
    setAddModal(false);
  };

  // Edit Product Handler
  const handleEditProduct = (product) => {
    setEditModal({ show: true, data: { ...product, originalName: product.name } });
  };

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

  // Delete Product Handler
  const handleDeleteProduct = (productName) => {
    if (window.confirm(`Delete "${productName}"?`)) {
      setInventory(inventory.filter(item => item.name !== productName));
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
            <h1 className="text-2xl md:text-3xl font-black uppercase text-[#EDEBDD]">Inventory</h1>
            <p className="text-[#EDEBDD]/50 text-[9px] uppercase font-bold mt-1">Manage Products</p>
          </div>
        </div>
        <button
          onClick={() => setAddModal(true)}
          className="bg-[#810100] hover:bg-[#a10100] text-[#EDEBDD] text-[10px] font-bold uppercase px-4 py-3 rounded flex items-center justify-center gap-2 transition-all btn-interactive whitespace-nowrap"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 border-2 border-[#810100]/40 p-5 rounded-lg hover-lift group animate-fade-in" style={{animationDelay: '0.1s'}}>
          <h3 className="text-[9px] uppercase tracking-wider opacity-50 mb-3">Total Products</h3>
          <p className="text-2xl md:text-3xl font-black text-[#EDEBDD]">{totalProducts}</p>
        </div>
        <div className="bg-white/5 border-2 border-[#810100]/40 p-5 rounded-lg hover-lift group animate-fade-in" style={{animationDelay: '0.15s'}}>
          <h3 className="text-[9px] uppercase tracking-wider opacity-50 mb-3">Healthy Stock</h3>
          <p className="text-2xl md:text-3xl font-black text-[#EDEBDD]">{healthyCount}</p>
        </div>
        <div className="bg-white/5 border-2 border-[#810100]/40 p-5 rounded-lg hover-lift group animate-fade-in" style={{animationDelay: '0.2s'}}>
          <h3 className="text-[9px] uppercase tracking-wider opacity-50 mb-3">Low Stock</h3>
          <p className="text-2xl md:text-3xl font-black text-[#EDEBDD]">{lowStockCount}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 animate-fade-in" style={{animationDelay: '0.25s'}}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#810100]" size={16} />
          <input
            type="text"
            placeholder="Search products..."
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
          <option value="all">All Items</option>
          <option value="healthy">Healthy Stock</option>
          <option value="low">Low Stock</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white/5 border border-[#810100]/40 rounded-lg overflow-hidden hover-lift animate-fade-in" style={{animationDelay: '0.25s'}}>
        <div className="overflow-x-auto">
          <table className="w-full text-[9px]">
            <thead className="bg-black/40 border-b border-[#810100]/20">
              <tr>
                <th className="text-left p-3 md:p-4 text-[#810100] font-bold uppercase">Product</th>
                <th className="text-left p-3 md:p-4 text-[#810100] font-bold uppercase">Stock</th>
                <th className="text-left p-3 md:p-4 text-[#810100] font-bold uppercase">Threshold</th>
                <th className="text-left p-3 md:p-4 text-[#810100] font-bold uppercase">Price</th>
                <th className="text-left p-3 md:p-4 text-[#810100] font-bold uppercase">Status</th>
                <th className="text-center p-3 md:p-4 text-[#810100] font-bold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((product, idx) => (
                  <tr key={product.name} className="border-b border-[#810100]/10 hover:bg-[#810100]/5 transition-colors">
                    <td className="p-3 md:p-4 text-[#EDEBDD] font-medium">{product.name}</td>
                    <td className="p-3 md:p-4 text-[#EDEBDD]">{product.remaining}</td>
                    <td className="p-3 md:p-4 text-[#EDEBDD]">{product.threshold}</td>
                    <td className="p-3 md:p-4 text-[#EDEBDD]">₱{product.price.toLocaleString()}</td>
                    <td className="p-3 md:p-4">
                      <span className="text-[8px] font-bold uppercase px-2 py-1 rounded bg-[#810100]/20 text-[#EDEBDD]">
                        {product.remaining > product.threshold ? '✓ OK' : '⚠ LOW'}
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
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#EDEBDD]/40 text-[10px] uppercase">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
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
              <h2 className="text-[#EDEBDD] uppercase font-bold text-lg">New Product</h2>
              <div className="h-1 w-12 bg-[#810100] mt-3"></div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[9px] uppercase text-[#810100] font-bold mb-2 block">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g., Tactical Vest"
                  className="w-full bg-white/5 border border-[#810100]/20 p-3 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all rounded"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase text-[#810100] font-bold mb-2 block">Price (PHP)</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-white/5 border border-[#810100]/20 p-3 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all rounded"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase text-[#810100] font-bold mb-2 block">Initial Stock</label>
                <input
                  type="number"
                  value={newProduct.remaining}
                  onChange={(e) => setNewProduct({ ...newProduct, remaining: e.target.value })}
                  placeholder="Quantity"
                  className="w-full bg-white/5 border border-[#810100]/20 p-3 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all rounded"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase text-[#810100] font-bold mb-2 block">Low Stock Threshold</label>
                <input
                  type="number"
                  value={newProduct.threshold}
                  onChange={(e) => setNewProduct({ ...newProduct, threshold: e.target.value })}
                  placeholder="5"
                  className="w-full bg-white/5 border border-[#810100]/20 p-3 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all rounded"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setAddModal(false)}
                className="flex-1 bg-white/5 border border-[#810100]/40 text-[#EDEBDD] px-4 py-3 rounded text-[10px] font-bold uppercase hover:bg-white/10 transition-all btn-interactive"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 bg-[#810100] text-[#EDEBDD] px-4 py-3 rounded text-[10px] font-bold uppercase hover:bg-[#a10100] transition-all btn-interactive"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

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

export default AdminProducts;
