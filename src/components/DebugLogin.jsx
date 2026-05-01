import React, { useState } from 'react';
import api from '../utils/api';

const DebugLogin = () => {
  const [email, setEmail] = useState('staff@gmail.com');
  const [password, setPassword] = useState('12345678');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log('=== LOGIN DEBUG ===');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);

      const res = await api.post('/api/staff-panel/auth/login', { 
        email, 
        password 
      });

      console.log('Response Status:', res.status);
      console.log('Response Data:', res.data);

      setResponse(res.data);

      if (res.data.token) {
        console.log('Token received:', res.data.token.substring(0, 20) + '...');
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('staff', JSON.stringify(res.data.staff));
        console.log('Token saved to localStorage');
      }
    } catch (err) {
      console.error('=== LOGIN ERROR ===');
      console.error('Error Status:', err.response?.status);
      console.error('Error Data:', err.response?.data);
      console.error('Error Message:', err.message);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Debug Login</h2>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Email: </label>
        <input 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '300px', padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Password: </label>
        <input 
          type="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '300px', padding: '5px' }}
        />
      </div>

      <button 
        onClick={handleLogin}
        disabled={loading}
        style={{ padding: '10px 20px', cursor: 'pointer' }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {error && (
        <div style={{ marginTop: '20px', color: 'red', border: '1px solid red', padding: '10px' }}>
          <strong>Error:</strong>
          <pre>{error}</pre>
        </div>
      )}

      {response && (
        <div style={{ marginTop: '20px', color: 'green', border: '1px solid green', padding: '10px' }}>
          <strong>Success:</strong>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginTop: '20px', backgroundColor: '#f0f0f0', padding: '10px' }}>
        <strong>LocalStorage:</strong>
        <pre>
          Token: {localStorage.getItem('token') ? 'SET' : 'NOT SET'}
          {'\n'}
          Staff: {localStorage.getItem('staff') ? 'SET' : 'NOT SET'}
        </pre>
      </div>
    </div>
  );
};

export default DebugLogin;
