import React from 'react';
import { RefreshCcw, Download } from 'lucide-react';

const DashboardHeader = ({ onReset }) => {
  return (
    /* c. Flex-col on mobile, flex-row on desktop. Items-start for mobile, items-end for desktop. */
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-6 md:gap-2 font-['Inter']">
      
      {/* Left Side: Title & Preview Warning */}
      <div className="w-full md:w-auto">
        <h1 className="text-3xl md:text-4xl font-black  uppercase text-[#EDEBDD]">
          Dashboard
        </h1>
        
        <div className="flex flex-wrap gap-2 items-center mt-2 opacity-90">
          <span className="text-[#810100] font-bold text-[9px] md:text-[10px] uppercase  bg-[#810100]/10 px-2 py-0.5 rounded border border-[#810100]/20 inline-block">
            Notice
          </span>
          <p className="text-[#EDEBDD] text-[10px] md:text-xs  opacity-60 leading-relaxed">
            This website is for preview purposes only. No real transactions will occur.
          </p>
        </div>
      </div>

      {/* Right Side: Action Buttons */}
      {/* Grid on mobile to keep buttons same size, flex on desktop */}
      <div className="grid grid-cols-2 md:flex gap-3 w-full md:w-auto">
        {/* Reset Button */}
        <button 
          onClick={onReset}
          className="flex items-center justify-center gap-2 bg-white/5 border border-[#810100]/40 hover:bg-white/10 hover:border-[#810100] text-[#EDEBDD] text-[9px] md:text-[10px] font-bold uppercase  md: px-3 md:px-6 py-3 rounded transition-all cursor-pointer group whitespace-nowrap"
        >
          <RefreshCcw size={14} className="text-[#810100] group-hover:rotate-180 transition-transform duration-500" /> 
          <span className="hidden sm:inline">Reset Data</span>
          <span className="sm:hidden">Reset</span>
        </button>
        
        {/* Export Button */}
        <button className="bg-[#810100] hover:bg-[#630000] text-white text-[9px] md:text-[10px] font-bold uppercase  md: px-3 md:px-6 py-3 rounded transition-all shadow-[0_0_15px_rgba(129,1,0,0.4)] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap">
          <Download size={14} />
          <span className="hidden sm:inline">Export Data</span>
          <span className="sm:hidden">Export</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;