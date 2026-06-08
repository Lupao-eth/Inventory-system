import React, { useState, useEffect } from 'react';
import { Search, Plus, FileDown, MoreHorizontal, Package, AlertTriangle, X } from 'lucide-react';
import AddProduct from '../dashboard/quick-actions/AddProduct';

const Products = ({ inventory = [], setInventory, isAdmin = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const [modal, setModal] = useState({ show: false, type: '', data: null });
  const [restrictedToast, setRestrictedToast] = useState(false);

  const filteredItems = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = inventory.length;
  const criticalCount = inventory.filter(p => p.remaining <= p.threshold).length;
  const healthyCount = totalProducts - criticalCount;

  const triggerRestricted = () => {
    setRestrictedToast(true);
    setActiveMenu(null);
  };

  useEffect(() => {
    if (restrictedToast) {
      const timer = setTimeout(() => setRestrictedToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [restrictedToast]);

  const openDeleteModal = (product) => {
    if (!isAdmin) return triggerRestricted();
    setModal({ show: true, type: 'delete', data: product });
    setActiveMenu(null);
  };

  const openEditModal = (product) => {
    if (!isAdmin) return triggerRestricted();
    setModal({ show: true, type: 'edit', data: { ...product, newName: product.name } });
    setActiveMenu(null);
  };

  const confirmAction = () => {
    if (modal.type === 'delete') {
      setInventory(inventory.filter(item => item.name !== modal.data.name));
    } else if (modal.type === 'edit') {
      setInventory(inventory.map(item =>
        item.name === modal.data.name ? { ...item, name: modal.data.newName } : item
      ));
    }
    setModal({ show: false, type: '', data: null });
  };

  return (
    <div className="min-h-screen bg-[#1B1717] p-4 md:p-6 lg:p-8 font-['Inter'] text-[#EDEBDD]">

      {/* RESTRICTED TOAST */}
      {restrictedToast && (
        <div className="fixed top-20 right-3 md:right-6 z-[200] animate-in slide-in-from-right zoom-in-95 duration-300">
          <div className="bg-[#1B1717] border border-[#810100] shadow-[0_0_20px_rgba(129,1,0,0.4)] flex flex-col w-[280px] md:min-w-[320px] overflow-hidden">
            <div className="flex items-center gap-3 p-3 md:p-4 bg-[#810100]/5">
              <div className="animate-pulse shrink-0">
                <AlertTriangle className="text-[#810100]" size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-[#810100]">Security Alert</p>
                <p className="text-[10px] font-bold opacity-90 uppercase leading-tight">
                  Admin Authorization Required: <br />
                  <span className="opacity-60 text-[9px]">Switch to Admin Mode in the navbar.</span>
                </p>
              </div>
            </div>
            <div className="h-[2px] bg-black/40 w-full">
              <div className="h-full bg-[#810100] animate-out slide-out-to-left fill-mode-forwards duration-[4000ms] ease-linear" />
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 bg-[#810100] shrink-0" />
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black uppercase text-[#EDEBDD]">Products</h1>
            <p className="text-[#EDEBDD]/40 text-[10px] uppercase font-bold">Product Inventory</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-56 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#810100]" size={15} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/40 border border-[#810100]/30 rounded pl-9 pr-3 py-2 text-xs outline-none focus:border-[#810100] transition-all w-full text-[#EDEBDD] placeholder:text-[#EDEBDD]/30 h-[36px]"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Add Product — invisible real button overlaid by styled div */}
            <div className="relative h-[36px] flex-1 sm:flex-none">
              <div className="absolute inset-0 opacity-0 pointer-events-auto">
                <AddProduct setInventory={setInventory} variant="button" />
              </div>
              <div className="flex items-center justify-center gap-1.5 bg-[#810100] border border-[#810100] px-3 rounded text-[10px] font-bold text-[#EDEBDD] h-[36px] whitespace-nowrap pointer-events-none select-none w-full">
                <Plus size={13} /> Add Product
              </div>
            </div>

            {/* Export CSV */}
            <button className="flex items-center justify-center gap-1.5 bg-red-700 border border-red-600 px-3 rounded text-[10px] font-bold text-[#EDEBDD] hover:bg-red-600 transition-all cursor-pointer h-[36px] whitespace-nowrap flex-1 sm:flex-none">
              <FileDown size={13} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white/5 border-2 border-[#810100]/40 p-5 md:p-6 rounded-md relative overflow-hidden">
          <p className="text-[10px] uppercase font-black mb-2 text-[#EDEBDD]">Total Products</p>
          <p className="text-3xl font-black text-[#EDEBDD]">{totalProducts}</p>
          <Package className="absolute -right-3 -bottom-3 opacity-[0.04] text-[#EDEBDD]" size={72} />
        </div>
        <div className="bg-white/5 border-2 border-[#810100]/40 p-5 md:p-6 rounded-md relative overflow-hidden">
          <p className="text-[10px] uppercase font-black mb-2 text-[#EDEBDD]">Critical Stock</p>
          <p className="text-3xl font-black text-[#EDEBDD]">{criticalCount}</p>
        </div>
        <div className="bg-white/5 border-2 border-[#810100]/40 p-5 md:p-6 rounded-md relative overflow-hidden">
          <p className="text-[10px] uppercase font-black mb-2 text-[#EDEBDD]">Healthy Stock</p>
          <p className="text-3xl font-black text-[#EDEBDD]">{healthyCount}</p>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-white/5 border-2 border-[#810100]/40 rounded-md overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-black/40 border-b-2 border-[#810100]/40">
                <th className="p-3 md:p-4 text-[10px] uppercase font-black text-[#EDEBDD] border-r border-[#810100]/20">Designation</th>
                <th className="p-3 md:p-4 text-[10px] uppercase font-black text-[#EDEBDD] border-r border-[#810100]/20">Price</th>
                <th className="p-3 md:p-4 text-[10px] uppercase font-black text-[#EDEBDD] border-r border-[#810100]/20 hidden sm:table-cell">Stock</th>
                <th className="p-3 md:p-4 text-[10px] uppercase font-black text-[#EDEBDD] border-r border-[#810100]/20">Status</th>
                <th className="p-3 md:p-4 text-[10px] uppercase font-black text-[#EDEBDD] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#810100]/20">
              {filteredItems.length > 0 ? (
                filteredItems.map((product, index) => {
                  const isCritical = product.remaining <= product.threshold;
                  const pct = Math.min(Math.round((product.remaining / 50) * 100), 100);

                  return (
                    <tr key={index} className="hover:bg-white/[0.02] transition-colors group">

                      {/* Name */}
                      <td className="p-3 md:p-4 border-r border-[#810100]/10">
                        <p className="text-xs font-semibold group-hover:text-[#810100] transition-colors text-[#EDEBDD] truncate max-w-[140px] md:max-w-none">
                          {product.name}
                        </p>
                      </td>

                      {/* Price */}
                      <td className="p-3 md:p-4 text-xs font-medium text-[#EDEBDD] border-r border-[#810100]/10 whitespace-nowrap">
                        ₱{product.price.toLocaleString()}.00
                      </td>

                      {/* Stock bar — hidden on very small screens */}
                      <td className="p-3 md:p-4 border-r border-[#810100]/10 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold min-w-[20px] text-[#EDEBDD]">{product.remaining}</span>
                          <div className="flex-1 h-[3px] bg-black/50 rounded-full overflow-hidden min-w-[40px] md:min-w-[60px]">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${isCritical ? 'bg-[#810100]' : 'bg-[#EDEBDD]/30'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3 md:p-4 border-r border-[#810100]/10">
                        {isCritical ? (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#810100] animate-pulse shrink-0" />
                            <span className="text-xs text-[#810100] font-medium whitespace-nowrap">Low stock</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#EDEBDD]/40 shrink-0" />
                            <span className="text-xs text-[#EDEBDD]/50 font-medium">Good</span>
                          </div>
                        )}
                      </td>

                      {/* Action menu */}
                      <td className="p-3 md:p-4 text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setActiveMenu(activeMenu === index ? null : index)}
                            className="text-[#EDEBDD]/20 hover:text-[#810100] transition-colors cursor-pointer p-1"
                          >
                            <MoreHorizontal size={17} />
                          </button>

                          {activeMenu === index && (
                            <>
                              <div className="absolute right-0 mt-2 w-44 bg-[#1B1717] border border-[#810100]/40 rounded shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <button
                                  onClick={() => openEditModal(product)}
                                  className="w-full flex items-center gap-2 px-4 py-3 text-xs hover:bg-[#810100]/20 transition-all text-[#EDEBDD] border-b border-[#810100]/10 text-left cursor-pointer"
                                >
                                  Edit product
                                </button>
                                <button
                                  onClick={() => openDeleteModal(product)}
                                  className="w-full flex items-center gap-2 px-4 py-3 text-xs hover:bg-[#810100]/30 transition-all text-red-400 text-left cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                              <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="p-12 md:p-20 text-center">
                    <p className="text-sm opacity-20 font-medium text-[#EDEBDD]">No products found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {modal.show && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setModal({ show: false, type: '', data: null })}
          />
          <div className="bg-[#1B1717] border-2 border-[#810100] w-full max-w-sm md:max-w-md relative z-10 shadow-[0_0_50px_rgba(129,1,0,0.3)] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 rounded-md">
            <div className="bg-[#810100]/10 p-4 border-b border-[#810100]/30 flex justify-between items-center">
              <p className="text-xs font-semibold text-[#810100]">
                {modal.type === 'delete' ? 'Delete product' : 'Edit product'}
              </p>
              <button
                onClick={() => setModal({ show: false, type: '', data: null })}
                className="text-[#EDEBDD]/40 hover:text-[#EDEBDD] cursor-pointer"
              >
                <X size={17} />
              </button>
            </div>

            <div className="p-6 md:p-8">
              {modal.type === 'delete' ? (
                <div className="text-center">
                  <p className="text-sm font-medium text-[#EDEBDD]/60 mb-2">Remove this product?</p>
                  <p className="text-base md:text-lg font-bold text-[#EDEBDD] mb-4 break-words">"{modal.data.name}"</p>
                  <p className="text-xs text-[#810100] font-medium mb-4">This action cannot be undone.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-xs font-medium text-[#EDEBDD]/40 block">New name</label>
                  <input
                    autoFocus
                    value={modal.data.newName}
                    onChange={(e) => setModal({ ...modal, data: { ...modal.data, newName: e.target.value } })}
                    className="w-full bg-black/40 border border-[#810100]/40 p-3 text-sm font-medium text-[#EDEBDD] outline-none focus:border-[#810100] transition-colors rounded"
                  />
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setModal({ show: false, type: '', data: null })}
                  className="flex-1 py-2.5 text-xs font-semibold text-[#EDEBDD]/60 border border-[#EDEBDD]/10 rounded hover:bg-white/5 cursor-pointer transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className="flex-1 py-2.5 text-xs font-semibold bg-[#810100] text-white rounded hover:bg-[#a10100] cursor-pointer transition-all active:scale-95"
                >
                  {modal.type === 'delete' ? 'Delete' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;