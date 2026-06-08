import React, { useState } from 'react';
import { Plus, X, Loader2, CheckCircle2 } from 'lucide-react';

// Added 'variant' prop to handle the different button styles for Dashboard vs Products
const AddProduct = ({ setInventory, variant = "default" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Logic States
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');

  const openModal = () => {
    setIsOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeModal = () => {
    if (isLoading) return; 
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
      setShowSuccess(false);
      setName('');
      setPrice('');
      setQty('');
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || !price || !qty) {
      alert("Please fill in all security fields.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newProduct = {
        name: name,
        remaining: Number(qty),
        price: Number(price),
        threshold: 5
      };

      setInventory(prev => [...prev, newProduct]);
      
      setIsLoading(false);
      setShowSuccess(true);

      setTimeout(() => {
        closeModal();
      }, 2000);
    }, 1800);
  };

  return (
    <>
      {/* 1. THE TRIGGER BUTTON - Updated for responsiveness and variants */}
      {variant === "icon" ? (
        <button 
          onClick={openModal}
          className="bg-[#810100] text-[#EDEBDD] p-2.5 rounded hover:bg-[#610000] transition-all flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase  hidden sm:inline">Add Product</span>
        </button>
      ) : (
        <button 
          onClick={openModal}
          className="w-full flex items-center justify-between p-4 bg-white/5 border-2 border-[#810100]/40 rounded-md hover:bg-[#810100]/10 hover:border-[#810100] transition-all group cursor-pointer"
        >
          <span className="text-[#EDEBDD] font-bold uppercase text-xs  cursor-pointer">Add New Product</span>
          <div className="bg-[#810100]/20 p-2 rounded-lg text-[#EDEBDD] group-hover:text-[#810100] transition-colors border-none cursor-pointer">
            <Plus size={18} strokeWidth={2.5} />
          </div>
        </button>
      )}

      {/* 2. THE MODAL */}
      {isOpen && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-default" onClick={closeModal}></div>
          
          <div className={`relative bg-[#1B1717] border-2 border-[#810100] w-full max-w-lg p-6 md:p-8 rounded-md shadow-[0_0_50px_rgba(129,1,0,0.4)] transform transition-all duration-300 ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'} overflow-hidden`}>
            
            {showSuccess && (
              <div className="absolute inset-0 z-50 bg-[#1B1717] flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-[#810100]/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <CheckCircle2 size={48} className="text-[#810100]" />
                </div>
                <h3 className="text-[#EDEBDD] uppercase font-black text-xl mb-2">Registry Updated</h3>
                <p className="text-[#EDEBDD]/60 text-[10px] uppercase">Item stored in inventory. Admin approval required bypassed in preview mode.</p>
              </div>
            )}

            <button 
              onClick={closeModal} 
              className={`absolute top-4 right-4 text-[#EDEBDD]/40 hover:text-[#810100] transition-colors z-10 ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <X size={20} className="cursor-pointer" />
            </button>

            <div className="mb-8">
              <h2 className="text-[#EDEBDD] uppercase font-black text-xl">Add Item</h2>
              <div className="h-1 w-16 bg-[#810100] mt-2"></div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] uppercase text-[#810100] font-bold mb-2 block">Product Identity</label>
                  <input 
                    disabled={isLoading}
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ENTER ITEM NAME..." 
                    className="w-full bg-white/5 border border-[#810100]/20 p-4 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all disabled:opacity-50"
                  />
                </div>

                {/* Changed to 1 column on mobile, 2 columns on desktop to prevent overflow */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase  text-[#810100] font-bold mb-2 block">Unit Price (PHP)</label>
                    <input 
                      disabled={isLoading}
                      type="number" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00" 
                      className="w-full bg-white/5 border border-[#810100]/20 p-4 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase  text-[#810100] font-bold mb-2 block">Initial Stock</label>
                    <input 
                      disabled={isLoading}
                      type="number" 
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      placeholder="QUANTITY" 
                      className="w-full bg-white/5 border border-[#810100]/20 p-4 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Changed to stack buttons vertically on mobile */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 bg-[#810100] py-4 text-[#EDEBDD] font-bold uppercase text-[10px] hover:bg-[#610000] transition-all active:scale-95 shadow-lg shadow-[#810100]/20 flex items-center justify-center gap-3 ${isLoading ? 'cursor-not-allowed bg-[#4a0000]' : 'cursor-pointer'}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : "Register Item"}
                </button>
                <button 
                  type="button"
                  disabled={isLoading}
                  onClick={closeModal}
                  className={`px-6 py-4 border border-[#810100]/30 text-[#EDEBDD]/40 font-bold uppercase  text-[9px] hover:text-[#EDEBDD] hover:bg-white/5 transition-all ${isLoading ? 'cursor-not-allowed opacity-20' : 'cursor-pointer'}`}
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

export default AddProduct;