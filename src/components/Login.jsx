import React, { useState } from "react";
import { FaSpinner, FaUserShield, FaLock, FaEnvelope } from 'react-icons/fa';
import { MdSchool, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { toast } from 'react-toastify';
import api from '../utils/api';

const StaffLogin = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!email || !password) {
      toast.error("Please enter email and password", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Attempting login with:', email);
      const res = await api.post('/api/staff-panel/auth/login', { email, password });
      
      console.log('Login response:', res.data);
      
      if (res.data && res.data.token) {
        console.log('Token received, saving to localStorage');
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('staff', JSON.stringify(res.data.staff));
        localStorage.setItem('userRole', res.data.staff?.role || 'staff');
        
        console.log('Login successful, token saved');
        
        toast.success('Login successful!', {
          position: "top-right",
          autoClose: 500,
        });
        
        // Call setIsLoggedIn to trigger navigation
        console.log('Calling setIsLoggedIn(true)');
        setIsLoggedIn(true);
      } else {
        console.log('No token in response:', res.data);
        toast.error(res.data?.message || 'Login failed', {
          position: "top-right",
          autoClose: 3000,
        });
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
      
      let errorMsg = 'Invalid credentials. Please try again.';
      
      if (err.response?.status === 401) {
        errorMsg = 'Invalid email or password';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      console.error('Error message:', errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/25 rounded-full blur-3xl animate-float-slow"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo/Header Section */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl shadow-blue-500/50 mb-4 animate-bounce-slow">
            <MdSchool className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            Staff Portal
          </h1>
          <p className="text-blue-200 text-sm font-medium">
            School Management System
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-fade-in-up">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30">
              <FaUserShield className="text-blue-300" />
              <span className="text-sm font-bold text-blue-100">Secure Login</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <FaEnvelope className="text-blue-400" />
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) {
                      handleLogin(e);
                    }
                  }}
                  disabled={loading}
                  className="w-full px-4 py-3.5 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 disabled:opacity-50 group-hover:border-white/30"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none"></div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <FaLock className="text-blue-400" />
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) {
                      handleLogin(e);
                    }
                  }}
                  disabled={loading}
                  className="w-full px-4 py-3.5 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 disabled:opacity-50 pr-12 group-hover:border-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-2"
                  disabled={loading}
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none"></div>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-6 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-blue-600/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-xl" />
                  <span className="text-lg">Authenticating...</span>
                </>
              ) : (
                <>
                  <FaUserShield className="text-xl" />
                  <span className="text-lg">Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Secure Connection</span>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-6 animate-fade-in">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} School Management System. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Powered by Advanced ERP Solutions
          </p>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(-15px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(20px); }
        }
        
        @keyframes particle {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-100vh) scale(1); opacity: 0; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        
        .animate-particle {
          animation: particle linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out 0.2s both;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out 0.4s both;
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default StaffLogin;
