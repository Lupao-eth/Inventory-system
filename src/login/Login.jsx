import React from 'react';
import { Shield, Box, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import the navigation hook

const Login = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-[#1B1717] border-2 border-[#630000] rounded-xl p-8 shadow-2xl shadow-black/95">
        
        <div className="flex flex-col items-center mb-10">
          <div className="bg-[#810100] p-2 rounded-md mb-4 shadow-[0_0_20px_rgba(129,1,0,0.3)]">
            <Box className="text-[#EDEBDD] w-8 h-8" />
          </div>
          <h1 className="text-[#EDEBDD] text-3xl font-bold tracking-widest uppercase">
            Tainerstock
          </h1>
          <p className="text-[#EDEBDD]/60 text-sm mt-1">
            Inventory Management
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-[#EDEBDD]/30 text-[10px] uppercase tracking-[0.2em] text-center mb-4">
            Select Access Level
          </p>

          <button className="w-full bg-[#810100] hover:bg-[#630000] transition-all text-[#EDEBDD] py-4 px-4 rounded-md flex items-center justify-center gap-3 font-bold text-sm uppercase tracking-wider shadow-lg shadow-black/40">
            <Shield size={20} />
            Continue as Admin
          </button>
          
          {/* Added onClick to navigate to /dashboard */}
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full border border-[#EDEBDD]/10 hover:bg-[#EDEBDD]/5 transition-all text-[#EDEBDD] py-4 px-4 rounded-md flex items-center justify-center gap-3 font-bold text-sm uppercase tracking-wider"
          >
            <UserCircle size={20} />
            Continue as Staff
          </button>
        </div>

        <div className="mt-8"></div>
      </div>
    </div>
  );
};

export default Login;