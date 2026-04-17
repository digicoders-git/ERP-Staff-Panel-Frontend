import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdBook, MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import Swal from 'sweetalert2';

const LibrarianLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const librarians = JSON.parse(localStorage.getItem('librarians') || '[]');
      const librarian = librarians.find(lib => lib.email === email && lib.password === password);

      if (librarian) {
        localStorage.setItem('librarianAuth', JSON.stringify({
          id: librarian.id,
          name: librarian.name,
          email: librarian.email,
          staffId: librarian.staffId,
          loginTime: new Date().toISOString()
        }));
        Swal.fire('Success!', 'Login successful', 'success');
        navigate('/librarian-dashboard');
      } else {
        Swal.fire('Error!', 'Invalid email or password', 'error');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-2xl">
                <MdBook className="text-4xl text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Librarian Portal</h1>
            <p className="text-blue-100">Library Management System</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <MdEmail className="absolute left-4 top-3.5 text-slate-400 text-xl" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <MdLock className="absolute left-4 top-3.5 text-slate-400 text-xl" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <MdVisibilityOff className="text-xl" /> : <MdVisibility className="text-xl" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            {/* Demo Credentials */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-600 mb-2">Demo Credentials:</p>
              <p className="text-xs text-slate-600">Email: <span className="font-bold">rajesh@school.com</span></p>
              <p className="text-xs text-slate-600">Password: <span className="font-bold">password123</span></p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white text-sm">
            Not a librarian? 
            <button onClick={() => navigate('/login')} className="ml-2 font-bold hover:underline">
              Go to Staff Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LibrarianLogin;
