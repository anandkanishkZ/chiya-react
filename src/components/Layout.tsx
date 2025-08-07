import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Table,
  Menu,
  ShoppingBag,
  Package,
  Users,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  MenuIcon,
  X,
  Coffee,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  List
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  icon: any;
  label: string;
  path?: string;
  submenu?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { 
    icon: Table, 
    label: 'Tables', 
    submenu: [
      { icon: List, label: 'View Tables', path: '/tables' },
      { icon: Plus, label: 'Add Table', path: '/tables/add' },
    ]
  },
  { icon: Menu, label: 'Menu', path: '/menu' },
  { icon: ShoppingBag, label: 'Orders', path: '/orders' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: Users, label: 'Attendance', path: '/attendance' },
  { icon: Receipt, label: 'Expenses', path: '/expenses' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Layout({ children }: LayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Tables']); // Tables expanded by default
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSubmenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isMenuItemActive = (item: MenuItem): boolean => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.submenu) {
      return item.submenu.some(subItem => location.pathname === subItem.path);
    }
    return false;
  };

  const isSubMenuItemActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const getCurrentPageTitle = () => {
    // Check for exact matches first
    for (const item of menuItems) {
      if (item.path === location.pathname) {
        return item.label;
      }
      // Check submenu items
      if (item.submenu) {
        for (const subItem of item.submenu) {
          if (subItem.path === location.pathname) {
            return subItem.label;
          }
        }
      }
    }
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#faf9f7' }}>
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: sidebarExpanded ? 280 : 80,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative flex flex-col shadow-2xl sidebar-container"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f8f6f3 50%, #f0ede7 100%)',
          borderRight: '1px solid rgba(158, 127, 87, 0.1)'
        }}
      >
        {/* Logo & Toggle */}
        <div 
          className="p-6 relative"
          style={{ borderBottom: '1px solid rgba(158, 127, 87, 0.1)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 50%, #76603d 100%)',
                  boxShadow: '0 8px 20px rgba(158, 127, 87, 0.3)'
                }}
              >
                <Coffee className="w-7 h-7 text-white drop-shadow-sm" />
              </div>
              {sidebarExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl font-bold"
                  style={{ 
                    background: 'linear-gradient(135deg, #9e7f57 0%, #6d5238 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Chiya Shop
                </motion.div>
              )}
            </div>
            
            {/* Expand/Collapse Toggle */}
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="p-2 rounded-lg transition-all duration-200 hover:shadow-md"
              style={{ 
                color: '#9e7f57',
                backgroundColor: 'rgba(158, 127, 87, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(158, 127, 87, 0.2)';
                e.currentTarget.style.color = '#6d5238';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(158, 127, 87, 0.1)';
                e.currentTarget.style.color = '#9e7f57';
              }}
            >
              {sidebarExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav 
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-2 sidebar-scroll"
          style={{
            maxHeight: 'calc(100vh - 200px)' // Ensure it doesn't overflow
          }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubmenu = !!item.submenu;
            const isExpanded = expandedMenus.includes(item.label);
            const isActive = isMenuItemActive(item);
            
            return (
              <div key={item.label}>
                {/* Main Menu Item */}
                {hasSubmenu ? (
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={`group w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'shadow-lg transform scale-105'
                        : 'hover:shadow-md hover:transform hover:scale-102'
                    }`}
                    style={{
                      background: isActive 
                        ? 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 50%, #76603d 100%)'
                        : 'transparent',
                      color: isActive ? 'white' : '#9e7f57'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(158, 127, 87, 0.1)';
                        e.currentTarget.style.color = '#6d5238';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#9e7f57';
                      }
                    }}
                  >
                    <div className={`flex items-center ${sidebarExpanded ? 'space-x-4' : 'justify-center w-full'}`}>
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarExpanded && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="font-medium text-sm"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </div>
                    
                    {sidebarExpanded && (
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {!sidebarExpanded && (
                      <div className="absolute left-20 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.path!}
                    className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'shadow-lg transform scale-105'
                        : 'hover:shadow-md hover:transform hover:scale-102'
                    }`}
                    style={{
                      background: isActive 
                        ? 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 50%, #76603d 100%)'
                        : 'transparent',
                      color: isActive ? 'white' : '#9e7f57'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(158, 127, 87, 0.1)';
                        e.currentTarget.style.color = '#6d5238';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#9e7f57';
                      }
                    }}
                  >
                    <div className={`flex items-center ${sidebarExpanded ? 'space-x-4' : 'justify-center w-full'}`}>
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarExpanded && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="font-medium text-sm"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </div>
                    
                    {/* Tooltip for collapsed state */}
                    {!sidebarExpanded && (
                      <div className="absolute left-20 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </Link>
                )}

                {/* Submenu Items */}
                {hasSubmenu && isExpanded && sidebarExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-6 mt-2 space-y-1"
                  >
                    {item.submenu!.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = isSubMenuItemActive(subItem.path!);
                      
                      return (
                        <Link
                          key={subItem.path}
                          to={subItem.path!}
                          className={`group flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                            isSubActive
                              ? 'shadow-md transform scale-105'
                              : 'hover:shadow-sm hover:transform hover:scale-102'
                          }`}
                          style={{
                            background: isSubActive 
                              ? 'linear-gradient(135deg, rgba(158, 127, 87, 0.9) 0%, rgba(138, 109, 74, 0.9) 100%)'
                              : 'transparent',
                            color: isSubActive ? 'white' : '#9e7f57',
                            marginLeft: '1rem'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.backgroundColor = 'rgba(158, 127, 87, 0.1)';
                              e.currentTarget.style.color = '#6d5238';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#9e7f57';
                            }
                          }}
                        >
                          <SubIcon className="w-4 h-4 flex-shrink-0" />
                          <span className="font-medium text-sm">{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div 
          className="p-4"
          style={{ borderTop: '1px solid rgba(158, 127, 87, 0.1)' }}
        >
          {/* User Profile */}
          <div className={`flex items-center mb-4 p-3 rounded-xl transition-all duration-200 ${
            sidebarExpanded ? 'space-x-3' : 'justify-center'
          }`}
          style={{ backgroundColor: 'rgba(158, 127, 87, 0.08)' }}
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md"
              style={{
                background: 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 100%)'
              }}
            >
              {user?.profile?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </div>
            {sidebarExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-semibold truncate" style={{ color: '#6d5238' }}>
                  {user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName}` : user?.username}
                </p>
                <p className="text-xs truncate" style={{ color: '#9e7f57' }}>
                  {user?.profile?.position || user?.role}
                </p>
              </motion.div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`group flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 ${
              sidebarExpanded ? 'space-x-3' : 'justify-center'
            }`}
            style={{ 
              color: '#dc2626',
              backgroundColor: 'rgba(220, 38, 38, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.2)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-medium text-sm"
              >
                Logout
              </motion.span>
            )}
            
            {/* Tooltip for collapsed state */}
            {!sidebarExpanded && (
              <div className="absolute left-20 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header 
          className="px-6 py-4 flex items-center justify-between shadow-sm"
          style={{
            background: 'linear-gradient(90deg, #ffffff 0%, #faf9f7 100%)',
            borderBottom: '1px solid rgba(158, 127, 87, 0.1)'
          }}
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg transition-all duration-200"
              style={{ 
                color: '#9e7f57',
                backgroundColor: 'rgba(158, 127, 87, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(158, 127, 87, 0.2)';
                e.currentTarget.style.color = '#6d5238';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(158, 127, 87, 0.1)';
                e.currentTarget.style.color = '#9e7f57';
              }}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
            <h1 
              className="text-2xl font-bold"
              style={{ 
                background: 'linear-gradient(135deg, #9e7f57 0%, #6d5238 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {getCurrentPageTitle()}
            </h1>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(158, 127, 87, 0.08)' }}>
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{
                  background: 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 100%)'
                }}
              >
                {user?.profile?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-medium" style={{ color: '#6d5238' }}>
                {user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName}` : user?.username}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#faf9f7' }}>
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}