import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = login(username, password);
      if (success) {
        toast.success('Welcome to Chiya Shop Admin!');
      } else {
        toast.error('Invalid credentials. Try admin/chiya123');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #f8f6f3 0%, #ede8e1 25%, #e6ddd4 50%, #d9cfc3 75%, #ccc0b1 100%)',
      backgroundImage: 'radial-gradient(circle at 25% 75%, rgba(158, 127, 87, 0.08) 0%, transparent 50%), radial-gradient(circle at 75% 25%, rgba(158, 127, 87, 0.05) 0%, transparent 50%)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200/50"
        style={{
          boxShadow: '0 25px 50px -12px rgba(158, 127, 87, 0.25), 0 0 0 1px rgba(158, 127, 87, 0.05)'
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 50%, #76603d 100%)',
              boxShadow: '0 10px 25px rgba(158, 127, 87, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            <Coffee className="w-10 h-10 text-white drop-shadow-sm" />
          </div>
          <h1 
            className="text-3xl font-bold bg-clip-text text-transparent mb-1"
            style={{
              background: 'linear-gradient(135deg, #9e7f57 0%, #6d5238 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Chiya Shop
          </h1>
          <p style={{ color: '#9e7f57' }} className="mt-2 font-medium text-sm">Admin Portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg transition-all bg-gray-50/50 text-gray-800"
              style={{
                border: '2px solid #e6ddd4',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#9e7f57';
                e.target.style.boxShadow = '0 0 0 3px rgba(158, 127, 87, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e6ddd4';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg transition-all pr-12 bg-gray-50/50 text-gray-800"
                style={{
                  border: '2px solid #e6ddd4',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#9e7f57';
                  e.target.style.boxShadow = '0 0 0 3px rgba(158, 127, 87, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e6ddd4';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                autoFocus={false}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                style={{ color: '#9e7f57' }}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#6d5238'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = '#9e7f57'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {/* Quick fill suggestion */}
            <div className="mt-2 text-xs" style={{ color: '#9e7f57' }}>
              💡 Tip: Your browser can save and autofill this password for future logins
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            style={{
              background: loading ? '#a5927a' : 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 50%, #76603d 100%)',
              boxShadow: '0 4px 15px rgba(158, 127, 87, 0.3)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #8a6d4a 0%, #76603d 50%, #6d5238 100%)';
                (e.target as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(158, 127, 87, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 50%, #76603d 100%)';
                (e.target as HTMLButtonElement).style.boxShadow = '0 4px 15px rgba(158, 127, 87, 0.3)';
              }
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div 
          className="mt-6 p-4 rounded-lg shadow-inner"
          style={{
            background: 'linear-gradient(135deg, #f5f2ee 0%, #ede8e1 100%)',
            border: '2px solid #e6ddd4'
          }}
        >
          <p className="text-sm font-semibold mb-2 flex items-center" style={{ color: '#6d5238' }}>
            ☕ Demo Credentials:
          </p>
          <p className="text-sm mb-1" style={{ color: '#9e7f57' }}>
            Username: <span className="font-mono bg-white/80 px-2 py-1 rounded" style={{ color: '#6d5238' }}>admin</span>
          </p>
          <p className="text-sm mb-3" style={{ color: '#9e7f57' }}>
            Password: <span className="font-mono bg-white/80 px-2 py-1 rounded" style={{ color: '#6d5238' }}>chiya123</span>
          </p>
          <button
            type="button"
            onClick={() => {
              setUsername('admin');
              setPassword('chiya123');
            }}
            className="w-full py-2 px-3 text-sm font-medium rounded-lg transition-all transform hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 100%)',
              color: 'white',
              border: 'none',
              boxShadow: '0 2px 8px rgba(158, 127, 87, 0.3)'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #8a6d4a 0%, #76603d 100%)';
              (e.target as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(158, 127, 87, 0.4)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 100%)';
              (e.target as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(158, 127, 87, 0.3)';
            }}
          >
            🚀 Auto-fill Demo Credentials
          </button>
        </div>

        {/* Forgot Password */}
        <div className="text-center mt-6">
          <button 
            className="text-sm transition-colors font-medium"
            style={{ color: '#9e7f57' }}
            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#6d5238'}
            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = '#9e7f57'}
          >
            Forgot Password?
          </button>
        </div>
      </motion.div>
    </div>
  );
}