import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    position: string;
    permissions: string[];
  };
  isActive: boolean;
  lastLogin?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<boolean>;
  updateProfile: (profileData: any) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('chiya-auth-token');
        const savedUser = localStorage.getItem('chiya-user');
        
        if (token && savedUser) {
          // Verify token is still valid by fetching profile
          const response = await authAPI.getProfile();
          if (response.status === 'success') {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('chiya-auth-token');
            localStorage.removeItem('chiya-user');
            localStorage.removeItem('chiya-auth');
          }
        }
      } catch (error) {
        // Token invalid or server error
        localStorage.removeItem('chiya-auth-token');
        localStorage.removeItem('chiya-user');
        localStorage.removeItem('chiya-auth');
        console.warn('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await authAPI.login(username, password);
      
      if (response.status === 'success') {
        const { user: userData, tokens } = response.data;
        
        // Store auth data
        localStorage.setItem('chiya-auth-token', tokens.accessToken);
        localStorage.setItem('chiya-refresh-token', tokens.refreshToken);
        localStorage.setItem('chiya-user', JSON.stringify(userData));
        localStorage.setItem('chiya-auth', 'true');
        
        // Update state
        setUser(userData);
        setIsAuthenticated(true);
        
        toast.success(`Welcome back, ${userData.profile.firstName}!`, {
          position: "top-right",
          autoClose: 3000,
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.', {
        position: "top-right",
        autoClose: 5000,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await authAPI.register(userData);
      
      if (response.status === 'success') {
        const { user: newUser, tokens } = response.data;
        
        // Store auth data
        localStorage.setItem('chiya-auth-token', tokens.accessToken);
        localStorage.setItem('chiya-refresh-token', tokens.refreshToken);
        localStorage.setItem('chiya-user', JSON.stringify(newUser));
        localStorage.setItem('chiya-auth', 'true');
        
        // Update state
        setUser(newUser);
        setIsAuthenticated(true);
        
        toast.success(`Account created successfully! Welcome, ${newUser.profile.firstName}!`, {
          position: "top-right",
          autoClose: 5000,
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.', {
        position: "top-right",
        autoClose: 5000,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await authAPI.updateProfile(profileData);
      
      if (response.status === 'success') {
        const updatedUser = response.data.user;
        
        // Update stored user data
        localStorage.setItem('chiya-user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        toast.success('Profile updated successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile.', {
        position: "top-right",
        autoClose: 5000,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Call logout API
      await authAPI.logout();
      
      // Clear state
      setIsAuthenticated(false);
      setUser(null);
      
      toast.info('You have been logged out successfully.', {
        position: "top-right",
        autoClose: 3000,
      });
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      setIsAuthenticated(false);
      setUser(null);
      
      toast.warning('Logged out (with errors)', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      register, 
      updateProfile, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}