import React, { useState } from 'react';
import { Box, Bell, ChevronDown, Menu, X, ShieldCheck, User, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define navigation items with their respective routes
  const navItems = [
    { name: 'DASHBOARD', path: isAdmin ? '/admin' : '/dashboard' },
    { name: 'PRODUCTS', path: isAdmin ? '/admin/products' : '/products' },
    { name: 'ORDERS', path: isAdmin ? '/admin/orders' : '/orders' },
  ];

  const handleNavClick = (item) => {
    setActiveTab(item.name);
    setIsMobileMenuOpen(false); // Close mobile sidebar on click
    navigate(item.path);
  };

  // Logic to toggle between Admin and Staff modes
  const toggleMode = () => {
    setIsMobileMenuOpen(false);
    if (isAdmin) {
      navigate('/dashboard'); // Switch to Staff Dashboard
    } else {
      navigate('/admin'); // Switch to Admin Dashboard
    }
  };

  return (
    <nav className="bg-[#1B1717] border-b border-[#810100]/30 px-4 md:px-6 py-3 flex items-center justify-between shadow-2xl shadow-black sticky top-0 z-[100] font-['Inter']">
      <div className="flex items-center gap-4 lg:gap-12">
        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-[#EDEBDD] p-1 hover:text-[#810100] transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Tactical Logo */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}>
          <div className="bg-[#810100] p-1.5 rounded shadow-[0_0_10px_#810100]">
            <Box size={18} className="text-white" />
          </div>
          <span className="font-black text-lg md:text-xl uppercase text-[#EDEBDD]">
            Inventory
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-6 lg:gap-8 text-[11px] uppercase font-bold">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item)}
              className={`transition-all duration-200 cursor-pointer hover:text-[#810100] outline-none whitespace-nowrap ${
                activeTab === item.name 
                ? 'text-[#810100]' 
                : 'text-[#EDEBDD]'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Right Side Actions & Profile */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Desktop Status Toggle Badge */}
        <div 
          onClick={toggleMode}
          className="hidden sm:flex items-center gap-2 bg-black/60 border border-[#810100]/40 px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#810100]/20 transition-all group"
        >
          <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px] ${isAdmin ? 'bg-blue-500 shadow-blue-500' : 'bg-[#810100] shadow-[#810100]'}`}></div>
          <span className="text-[10px] uppercase font-bold  text-[#EDEBDD]">
            {isAdmin ? 'Admin Mode' : 'Staff Mode'}
          </span>
          <ChevronDown size={12} className="opacity-50 text-[#EDEBDD] group-hover:rotate-180 transition-transform" />
        </div>
        
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative cursor-pointer group">
            <Bell size={20} className="text-[#EDEBDD] opacity-60 group-hover:text-[#810100] transition-all" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#810100] rounded-full"></span>
          </div>
          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full border border-[#810100]/50 overflow-hidden bg-gray-800 cursor-pointer">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`absolute left-0 top-0 h-screen w-64 bg-[#1B1717] border-r border-[#810100]/30 p-6 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sidebar Header */}
          <div className="flex items-center gap-2 mb-10 pb-4 border-b border-[#810100]/20">
            <div className="bg-[#810100] p-1 rounded">
              <Box size={14} className="text-white" />
            </div>
            <span className="font-black text-sm uppercase text-[#EDEBDD]">Registry Menu</span>
          </div>

          {/* Sidebar Nav Links */}
          <div className="flex flex-col gap-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className={`text-left text-[11px] uppercase  font-black transition-all ${
                  activeTab === item.name 
                  ? 'text-[#810100] translate-x-2' 
                  : 'text-[#EDEBDD]/60 hover:text-[#EDEBDD]'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Mobile Status Switcher Component */}
          <div className="mt-12">
             <p className="text-[9px] uppercase text-[#810100] font-black mb-3 ml-1">Access Level</p>
             <button 
                onClick={toggleMode}
                className={`w-full flex items-center justify-between p-3 rounded border transition-all active:scale-95 ${
                  isAdmin 
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' 
                  : 'bg-[#810100]/10 border-[#810100]/30 text-[#810100]'
                }`}
             >
                <div className="flex items-center gap-3">
                  {isAdmin ? <ShieldCheck size={16} /> : <User size={16} />}
                  <span className="text-[10px] uppercase font-black text-[#EDEBDD]">
                    {isAdmin ? 'Admin Mode' : 'Staff Mode'}
                  </span>
                </div>
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isAdmin ? 'bg-blue-500' : 'bg-[#810100]'}`}></div>
             </button>
             <p className="text-[8px] uppercase text-[#EDEBDD]/20 mt-2 text-center">Click to switch authorization</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;