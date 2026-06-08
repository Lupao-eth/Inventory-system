import React, { useState } from 'react';
import { Activity, X, Loader2, CheckCircle2 } from 'lucide-react';

const Stock = ({ inventory, setInventory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Logic States
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [selectedProduct, setSelectedProduct] = useState('');
  const [receivedQty, setReceivedQty] = useState('');
  const [supplier, setSupplier] = useState('');

  // Logic to handle smooth opening/closing
  const openModal = () => {
    setIsOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeModal = () => {
    if (isLoading) return; // Prevent closing during process
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
      setShowSuccess(false);
      // Reset form
      setSelectedProduct('');
      setReceivedQty('');
      setSupplier('');
    }, 300);
  };

  const handleUpdateInventory = (e) => {
    e.preventDefault();

    // 1. Validation
    if (!selectedProduct || !receivedQty || !supplier) {
      alert("Please specify item, units, and supplier source.");
      return;
    }

    // Start Processing Animation
    setIsLoading(true);

    setTimeout(() => {
      // 2. Update Inventory (Addition)
      setInventory(prevInv => prevInv.map(item => 
        item.name === selectedProduct 
          ? { ...item, remaining: item.remaining + Number(receivedQty) }
          : item
      ));

      setIsLoading(false);
      setShowSuccess(true);

      // Auto-close after showing success
      setTimeout(() => {
        closeModal();
      }, 2000);
    }, 1800); // 1.8 seconds processing time
  };

  return (
    <>
      {/* 1. THE TRIGGER BUTTON */}
      <button 
        onClick={openModal}
        className="w-full flex items-center justify-between p-4 bg-white/5 border-2 border-[#810100]/40 rounded-md hover:bg-[#810100]/10 hover:border-[#810100] transition-all group cursor-pointer"
      >
        <span className="text-[#EDEBDD] font-bold uppercase text-xs cursor-pointer">Receive Stock</span>
        <div className="bg-[#810100]/20 p-2 rounded-lg text-[#EDEBDD] group-hover:text-[#810100] transition-colors border-none cursor-pointer">
          <Activity size={18} strokeWidth={2.5} />
        </div>
      </button>

      {/* 2. THE MODAL */}
      {isOpen && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-default" onClick={closeModal}></div>
          
          {/* Modal Box */}
          <div className={`relative bg-[#1B1717] border-2 border-[#810100] w-full max-w-lg p-8 rounded-md shadow-[0_0_50px_rgba(129,1,0,0.4)] transform transition-all duration-300 ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'} overflow-hidden`}>
            
            {/* Success Overlay */}
            {showSuccess && (
              <div className="absolute inset-0 z-50 bg-[#1B1717] flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-[#810100]/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <CheckCircle2 size={48} className="text-[#810100]" />
                </div>
                <h3 className="text-[#EDEBDD] uppercase font-black text-xl mb-2">Stock Authorized</h3>
                <p className="text-[#EDEBDD]/60 text-[10px] uppercase text-center px-8">Units added to inventory. Admin approval required bypassed in preview mode.</p>
              </div>
            )}

            {/* Close Button */}
            <button 
              onClick={closeModal} 
              className={`absolute top-4 right-4 text-[#EDEBDD]/40 hover:text-[#810100] transition-colors z-10 ${isLoading ? 'cursor-not-allowed opacity-20' : 'cursor-pointer'}`}
            >
              <X size={20} className="cursor-pointer" />
            </button>

            {/* Form Header */}
            <div className="mb-8">
              <h2 className="text-[#EDEBDD] uppercase font-black text-xl">Receive Stock</h2>
              <div className="h-1 w-16 bg-[#810100] mt-2"></div>
            </div>

            {/* MODAL FORM CONTENT */}
            <form className="space-y-6" onSubmit={handleUpdateInventory}>
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] uppercase text-[#810100] font-bold mb-2 block">Item Selection</label>
                  <select 
                    disabled={isLoading}
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full bg-white/5 border border-[#810100]/20 p-4 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="" className="bg-[#1B1717]">SELECT ITEM TO RESTOCK...</option>
                    {inventory.map((item, idx) => (
                      <option key={idx} value={item.name} className="bg-[#1B1717]">
                        {item.name} (Current: {item.remaining})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase text-[#810100] font-bold mb-2 block">Units Received</label>
                    <input 
                      disabled={isLoading}
                      type="number" 
                      value={receivedQty}
                      onChange={(e) => setReceivedQty(e.target.value)}
                      placeholder="0" 
                      className="w-full bg-white/5 border border-[#810100]/20 p-4 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase text-[#810100] font-bold mb-2 block">Supplier Source</label>
                    <input 
                      disabled={isLoading}
                      type="text" 
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      placeholder="VENDOR NAME" 
                      className="w-full bg-white/5 border border-[#810100]/20 p-4 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 bg-[#810100] py-4 text-[#EDEBDD] font-bold uppercase text-[10px] hover:bg-[#610000] transition-all active:scale-95 shadow-lg shadow-[#810100]/20 flex items-center justify-center gap-3 ${isLoading ? 'cursor-not-allowed bg-[#4a0000]' : 'cursor-pointer'}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Updating...
                    </>
                  ) : "Update Inventory"}
                </button>
                <button 
                  type="button"
                  disabled={isLoading}
                  onClick={closeModal}
                  className={`px-6 border border-[#810100]/30 text-[#EDEBDD]/40 font-bold uppercase text-[9px] hover:text-[#EDEBDD] hover:bg-white/5 transition-all ${isLoading ? 'cursor-not-allowed opacity-20' : 'cursor-pointer'}`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Stock;