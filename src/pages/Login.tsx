import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { login, isAuthenticated, isLoading } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting', {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    try {
      const success = await login(username.trim(), password);
      if (!success) {
        // Error is already handled by AuthContext with toast
        setPassword(''); // Clear password on failed login
      }
    } catch (error) {
      console.error('Login submission error:', error);
      toast.error('An unexpected error occurred. Please try again.', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleInputChange = (field: 'username' | 'password', value: string) => {
    if (field === 'username') {
      setUsername(value);
    } else {
      setPassword(value);
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTestLogin = (type: 'admin' | 'manager') => {
    if (type === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('chiya_admin');
      setPassword('chiya123');
    }
    setErrors({});
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
              onChange={(e) => handleInputChange('username', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg transition-all bg-gray-50/50 text-gray-800 ${
                errors.username ? 'border-red-500' : ''
              }`}
              style={{
                border: errors.username ? '2px solid #ef4444' : '2px solid #e6ddd4',
              }}
              onFocus={(e) => {
                if (!errors.username) {
                  e.target.style.borderColor = '#9e7f57';
                  e.target.style.boxShadow = '0 0 0 3px rgba(158, 127, 87, 0.1)';
                }
              }}
              onBlur={(e) => {
                if (!errors.username) {
                  e.target.style.borderColor = '#e6ddd4';
                  e.target.style.boxShadow = 'none';
                }
              }}
              placeholder="Enter your username"
              autoComplete="username"
              disabled={isLoading}
              required
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg transition-all pr-12 bg-gray-50/50 text-gray-800 ${
                  errors.password ? 'border-red-500' : ''
                }`}
                style={{
                  border: errors.password ? '2px solid #ef4444' : '2px solid #e6ddd4',
                }}
                onFocus={(e) => {
                  if (!errors.password) {
                    e.target.style.borderColor = '#9e7f57';
                    e.target.style.boxShadow = '0 0 0 3px rgba(158, 127, 87, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  if (!errors.password) {
                    e.target.style.borderColor = '#e6ddd4';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                style={{ color: '#9e7f57' }}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#6d5238'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = '#9e7f57'}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.password}
              </p>
            )}
            {/* Quick fill suggestion */}
            <div className="mt-2 text-xs" style={{ color: '#9e7f57' }}>
              💡 Tip: Your browser can save and autofill this password for future logins
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            style={{
              background: isLoading ? '#a5927a' : 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 50%, #76603d 100%)',
              boxShadow: '0 4px 15px rgba(158, 127, 87, 0.3)',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #8a6d4a 0%, #76603d 50%, #6d5238 100%)';
                (e.target as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(158, 127, 87, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 50%, #76603d 100%)';
                (e.target as HTMLButtonElement).style.boxShadow = '0 4px 15px rgba(158, 127, 87, 0.3)';
              }
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
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
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="text-xs p-2 rounded bg-white/80" style={{ color: '#6d5238' }}>
              <strong>Admin:</strong><br />
              admin / admin123
            </div>
            <div className="text-xs p-2 rounded bg-white/80" style={{ color: '#6d5238' }}>
              <strong>Manager:</strong><br />
              chiya_admin / chiya123
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleTestLogin('admin')}
              disabled={isLoading}
              className="py-2 px-3 text-xs font-medium rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                }
              }}
            >
              👑 Admin Login
            </button>
            <button
              type="button"
              onClick={() => handleTestLogin('manager')}
              disabled={isLoading}
              className="py-2 px-3 text-xs font-medium rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                }
              }}
            >
              � Manager Login
            </button>
          </div>
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