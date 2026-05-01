import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DebugLogin from './components/DebugLogin';

function AppContent() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleSetIsLoggedIn = (value) => {
    if (value) {
      setIsLoggedIn(true);
      navigate('/dashboard', { replace: true });
    } else {
      localStorage.clear();
      sessionStorage.clear();
      setIsLoggedIn(false);
      navigate('/login', { replace: true });
    }
  };

  return (
    <Routes>
      <Route path="/debug-login" element={<DebugLogin />} />
      <Route 
        path="/login" 
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login setIsLoggedIn={handleSetIsLoggedIn} />} 
      />
      <Route 
        path="/*" 
        element={isLoggedIn ? <Dashboard setIsLoggedIn={handleSetIsLoggedIn} /> : <Navigate to="/login" replace />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Toaster position="top-center" reverseOrder={false} />
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
