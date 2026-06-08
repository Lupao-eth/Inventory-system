import React from 'react';

const Transactions = ({ orders = [] }) => {
  return (
    <div className="bg-white/5 border-2 border-[#810100]/40 rounded-md overflow-hidden font-['Inter']">
      <div className="flex justify-between items-center p-4 border-b border-[#810100]/20 bg-black/20">
        <h3 className="text-[#EDEBDD] uppercase text-[10px] font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-[#810100] rounded-full animate-pulse"></span>
          Recent Order Logs
        </h3>
        <span className="text-[9px] text-[#EDEBDD]/40 uppercase font-bold">
          {orders.length} Entries Recorded
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#810100]/10">
              <th className="px-4 py-3 text-[9px] uppercase text-[#EDEBDD] font-bold ">Ref ID</th>
              <th className="px-4 py-3 text-[9px] uppercase text-[#EDEBDD] font-bold ">Item Manifest</th>
              <th className="px-4 py-3 text-[9px] uppercase text-[#EDEBDD] font-bold  text-right">Value</th>
              <th className="px-4 py-3 text-[9px] uppercase text-[#EDEBDD] font-bold  text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#810100]/10">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-[11px] font-mono text-[#EDEBDD] opacity-60">
                    #{order.id}
                  </td>
                  <td className="px-4 py-3 text-[11px] font-bold text-[#EDEBDD]">
                    {order.item}
                  </td>
                  <td className="px-4 py-3 text-[11px] font-bold text-[#EDEBDD] text-right">
                    ₱{Number(order.total).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                      order.status === 'Completed' 
                        ? 'text-[#810100] border-[#810100]/20 bg-[#810100]/10' 
                        : 'text-[#EDEBDD] border-white/10'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-10 text-center text-[10px] uppercase text-[#EDEBDD]/20 italic">
                  No transaction data found in vault.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;