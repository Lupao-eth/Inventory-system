import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const StatCard = ({ title, value, icon, subtitle, type, items }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isAlert = type === 'alert';
  const hasItems = items && items.length > 0;

  return (
    <div 
      className={`bg-white/5 border-2 ${
        isAlert 
          ? 'border-[#810100] shadow-[inset_0_0_20px_rgba(129,1,0,0.25)]' 
          : 'border-[#810100]/40'
      } px-5 py-4 rounded-md relative overflow-hidden group hover:border-[#810100] transition-all font-['Inter'] flex flex-col`}
    >
      {/* Red Pulse Light for Alert state */}
      {isAlert && (
        <>
          <div className="absolute inset-0 bg-[#810100]/5 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#810100]/30 blur-[50px] -mr-12 -mt-12 animate-pulse"></div>
        </>
      )}

      <div className="flex justify-between items-start relative z-10">
        <div>
          {/* Title */}
          <p className="text-[9px] uppercase font-bold text-[#EDEBDD] mb-1.5 opacity-80">
            {title}
          </p>
          
          {/* Value */}
          <h2 className="text-3xl font-black text-[#EDEBDD]">
            {value}
          </h2>
          
          {subtitle && (
            <div className="flex gap-1.5 items-center mt-2 text-[10px] font-medium text-[#EDEBDD]">
               {subtitle}
            </div>
          )}
        </div>

        {/* Icon Container */}
        <div className="p-2.5 rounded-lg transition-all bg-[#810100]/20 backdrop-blur-md group-hover:bg-[#810100]/30">
           {React.isValidElement(icon) 
             ? React.cloneElement(icon, { 
                 size: 18, 
                 strokeWidth: 2.5,
                 className: `${isAlert ? "text-[#810100]" : "text-[#EDEBDD]"}` 
               }) 
             : <span className={isAlert ? "text-[#810100]" : "text-[#EDEBDD]"}>{icon}</span>}
        </div>
      </div>

      {/* c. Dropdown Toggle for Inventory Items */}
      {hasItems && (
        <div className="mt-4 pt-3 border-t border-[#810100]/20 relative z-10">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-[9px] font-bold uppercase  text-[#EDEBDD]/60 hover:text-[#EDEBDD] transition-colors cursor-pointer"
          >
            {isExpanded ? 'Hide Details' : 'View Specific Items'}
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {/* Expandable List */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-40 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
            <ul className="space-y-2 pb-1">
              {items.map((item, index) => (
                <li key={index} className="flex justify-between items-center text-[10px] border-b border-white/5 pb-1.5 last:border-0">
                  <span className="text-[#EDEBDD]/80 font-medium uppercase">{item.name}</span>
                  <span className="text-[#EDEBDD] font-bold bg-[#810100]/20 px-1.5 rounded text-[9px]">{item.qty}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;