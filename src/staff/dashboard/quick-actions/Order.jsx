import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Loader2, CheckCircle2, Plus } from 'lucide-react';

const Order = ({ inventory, setInventory, setOrders, variant = "card" }) => {
  // Now managing its own open state internally, just like AddProduct
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Logic States
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [customer, setCustomer] = useState('');

  // Sync animation state
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    if (isLoading) return; 
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
      setShowSuccess(false);
      setSelectedProduct('');
      setQuantity('');
      setCustomer('');
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedProduct || !quantity || !customer) {
      alert("Please complete all order fields.");
      return;
    }

    const product = inventory.find(item => item.name === selectedProduct);
    const orderQty = Number(quantity);

    if (product.remaining < orderQty) {
      alert(`Insufficient stock! Only ${product.remaining} units available.`);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Update Inventory
      setInventory(prevInv => prevInv.map(item => 
        item.name === selectedProduct 
          ? { ...item, remaining: item.remaining - orderQty }
          : item
      ));

      // Create Order Record
      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        item: selectedProduct,
        total: product.price * orderQty,
        customer: customer,
        status: "Completed",
        date: new Date().toISOString().split('T')[0]
      };

      setOrders(prevOrders => [newOrder, ...prevOrders]);
      
      setIsLoading(false);
      setShowSuccess(true);

      setTimeout(() => {
        closeModal();
      }, 2000);
    }, 1800);
  };

  return (
    <>
      {/* 1. CONDITIONAL TRIGGER BUTTON */}
      {variant === "button" ? (
        // Style for Orders Page (Small Red Button)
        <button 
          onClick={openModal}
          className="flex items-center gap-2 bg-[#810100] text-[#EDEBDD] px-4 py-2.5 rounded text-[10px] font-black uppercase hover:bg-[#a10100] transition-all cursor-pointer shadow-lg shadow-[#810100]/20"
        >
          <Plus size={16} /> Add Order
        </button>
      ) : (
        // Style for Dashboard Quick Actions (Card style)
        <button 
          onClick={openModal}
          className="w-full flex items-center justify-between p-4 bg-white/5 border-2 border-[#810100]/40 rounded-md hover:bg-[#810100]/10 hover:border-[#810100] transition-all group cursor-pointer"
        >
          <span className="text-[#EDEBDD] font-bold uppercase text-xs cursor-pointer">Process Order</span>
          <div className="bg-[#810100]/20 p-2 rounded-lg text-[#EDEBDD] group-hover:text-[#810100] transition-colors border-none cursor-pointer">
            <ShoppingCart size={18} strokeWidth={2.5} />
          </div>
        </button>
      )}

      {/* 2. THE MODAL */}
      {isOpen && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-default" onClick={closeModal}></div>
          
          <div className={`relative bg-[#1B1717] border-2 border-[#810100] w-full max-w-lg p-8 rounded-md shadow-[0_0_50px_rgba(129,1,0,0.4)] transform transition-all duration-300 ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'} overflow-hidden`}>
            
            {showSuccess && (
              <div className="absolute inset-0 z-50 bg-[#1B1717] flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-[#810100]/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <CheckCircle2 size={48} className="text-[#810100]" />
                </div>
                <h3 className="text-[#EDEBDD] uppercase font-black text-xl mb-2">Order Finalized</h3>
                <p className="text-[#EDEBDD]/60 text-[10px] uppercase text-center px-8">Transaction successful. Admin approval bypassed.</p>
              </div>
            )}

            <button 
              onClick={closeModal} 
              className={`absolute top-4 right-4 text-[#EDEBDD]/40 hover:text-[#810100] transition-colors z-10 ${isLoading ? 'cursor-not-allowed opacity-20' : 'cursor-pointer'}`}
            >
              <X size={20} className="cursor-pointer" />
            </button>

            <div className="mb-8">
              <h2 className="text-[#EDEBDD] uppercase font-black text-xl">Process Order</h2>
              <div className="h-1 w-16 bg-[#810100] mt-2"></div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] uppercase text-[#810100] font-bold mb-2 block">Select Product</label>
                  <select 
                    disabled={isLoading}
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full bg-white/5 border border-[#810100]/20 p-4 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="" className="bg-[#1B1717]">SELECT AN ITEM...</option>
                    {inventory.map((item, idx) => (
                      <option key={idx} value={item.name} className="bg-[#1B1717]">
                        {item.name} ({item.remaining} in stock)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase text-[#810100] font-bold mb-2 block">Order Quantity</label>
                    <input 
                      disabled={isLoading}
                      type="number" 
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0" 
                      className="w-full bg-white/5 border border-[#810100]/20 p-4 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase text-[#810100] font-bold mb-2 block">Customer Name</label>
                    <input 
                      disabled={isLoading}
                      type="text" 
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                      placeholder="IDENTIFY RECIPIENT" 
                      className="w-full bg-white/5 border border-[#810100]/20 p-4 text-[#EDEBDD] text-xs outline-none focus:border-[#810100] transition-all disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
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
                  ) : "Complete Transaction"}
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

export default Order;