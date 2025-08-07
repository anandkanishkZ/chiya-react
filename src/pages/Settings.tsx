import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Upload, Moon, Sun, Store, CreditCard, Bell,
  Shield, Palette, Clock, Smartphone, Monitor,
  Settings as SettingsIcon, Coffee, Plus, Trash2, Check, X
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

interface TabItem {
  id: string;
  label: string;
  icon: any;
  badge?: number;
}

const tabs: TabItem[] = [
  { id: 'general', label: 'General', icon: Store },
  { id: 'business', label: 'Business Info', icon: Coffee },
  { id: 'payment', label: 'Payments', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'advanced', label: 'Advanced', icon: SettingsIcon },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  const [settings, setSettings] = useState({
    general: {
      shopName: 'Chiya Shop',
      tagline: 'Authentic Nepali Tea Experience',
      language: 'en',
      timezone: 'Asia/Kathmandu',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h'
    },
    business: {
      name: 'Chiya Shop Pvt. Ltd.',
      address: 'Thamel, Kathmandu, Nepal',
      phone: '+977-9876543210',
      email: 'info@chiyashop.com',
      website: 'www.chiyashop.com',
      taxNumber: 'NP-12345678901',
      registrationNumber: 'REG-2024-001',
      workingHours: {
        monday: { open: '07:00', close: '22:00', closed: false },
        tuesday: { open: '07:00', close: '22:00', closed: false },
        wednesday: { open: '07:00', close: '22:00', closed: false },
        thursday: { open: '07:00', close: '22:00', closed: false },
        friday: { open: '07:00', close: '22:00', closed: false },
        saturday: { open: '08:00', close: '23:00', closed: false },
        sunday: { open: '08:00', close: '21:00', closed: false }
      }
    },
    payment: {
      currency: 'NPR',
      taxRate: 13,
      serviceCharge: 10,
      methods: {
        cash: { enabled: true, icon: 'cash' },
        card: { enabled: true, merchantId: 'CHIYA_MERCHANT_001' },
        esewa: { enabled: true, merchantCode: '9876543210' },
        khalti: { enabled: true, publicKey: 'test_public_key_xxx' },
        fonepay: { enabled: false, merchantCode: '' },
        paypal: { enabled: false, clientId: '' }
      }
    },
    notifications: {
      system: {
        lowStock: { enabled: true, threshold: 10 },
        orderComplete: { enabled: true, sound: true },
        dailyReport: { enabled: true, time: '18:00' },
        weeklyReport: { enabled: false, day: 'sunday' }
      },
      channels: {
        inApp: true,
        email: false,
        sms: false,
        push: true
      }
    },
    appearance: {
      theme: 'light',
      primaryColor: '#9e7f57',
      accentColor: '#8a6d4a',
      fontSize: 'medium',
      animations: true,
      soundEffects: true,
      compactMode: false
    },
    security: {
      twoFactor: false,
      sessionTimeout: 60,
      passwordExpiry: 90,
      loginAttempts: 5,
      ipWhitelist: [],
      dataBackup: {
        enabled: true,
        frequency: 'daily',
        retention: 30
      }
    },
    advanced: {
      debugMode: false,
      apiRateLimit: 1000,
      cacheEnabled: true,
      compressionEnabled: true,
      analyticsEnabled: true,
      errorReporting: true
    }
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Settings saved successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Failed to save settings. Please try again.', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const updateNestedSetting = (category: string, section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [section]: {
          ...(prev[category as keyof typeof prev] as any)[section],
          [key]: value
        }
      }
    }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf9f7' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200/50 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 100%)'
              }}
            >
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#6d5238' }}>Settings</h1>
              <p className="text-sm" style={{ color: '#9e7f57' }}>
                Manage your shop configuration and preferences
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            style={{
              background: isLoading 
                ? 'linear-gradient(135deg, #a5927a 0%, #8a6d4a 100%)'
                : 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 50%, #76603d 100%)'
            }}
          >
            {isLoading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Tabs */}
        <div className="w-80 bg-white shadow-lg border-r border-gray-200/50 min-h-screen">
          <div className="p-6">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'shadow-lg transform scale-105' 
                        : 'hover:shadow-md hover:transform hover:scale-102'
                    }`}
                    style={{
                      background: isActive 
                        ? 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 50%, #76603d 100%)'
                        : 'rgba(158, 127, 87, 0.05)',
                      color: isActive ? 'white' : '#9e7f57'
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span 
                        className={`px-2 py-1 text-xs font-bold rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
          
          {/* User Info */}
          <div className="px-6 py-4 border-t border-gray-200/50 mt-auto">
            <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(158, 127, 87, 0.08)' }}>
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 100%)' }}
              >
                {user?.profile?.firstName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: '#6d5238' }}>
                  {user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName}` : user?.username}
                </p>
                <p className="text-xs truncate" style={{ color: '#9e7f57' }}>
                  {user?.profile?.position || user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl"
            >
              {activeTab === 'general' && <GeneralSettings settings={settings.general} updateSetting={(key, value) => updateSetting('general', key, value)} />}
              {activeTab === 'business' && <BusinessSettings settings={settings.business} updateSetting={(key, value) => updateSetting('business', key, value)} updateNestedSetting={(section, key, value) => updateNestedSetting('business', section, key, value)} />}
              {activeTab === 'payment' && <PaymentSettings settings={settings.payment} updateSetting={(key, value) => updateSetting('payment', key, value)} updateNestedSetting={(section, key, value) => updateNestedSetting('payment', section, key, value)} />}
              {activeTab === 'notifications' && <NotificationSettings settings={settings.notifications} updateNestedSetting={(section, key, value) => updateNestedSetting('notifications', section, key, value)} />}
              {activeTab === 'appearance' && <AppearanceSettings settings={settings.appearance} updateSetting={(key, value) => updateSetting('appearance', key, value)} />}
              {activeTab === 'security' && <SecuritySettings settings={settings.security} updateSetting={(key, value) => updateSetting('security', key, value)} updateNestedSetting={(section, key, value) => updateNestedSetting('security', section, key, value)} />}
              {activeTab === 'advanced' && <AdvancedSettings settings={settings.advanced} updateSetting={(key, value) => updateSetting('advanced', key, value)} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// General Settings Component
function GeneralSettings({ settings, updateSetting }: { settings: any, updateSetting: (key: string, value: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-lg font-semibold mb-6 flex items-center" style={{ color: '#6d5238' }}>
          <Store className="w-5 h-5 mr-2" />
          Shop Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Shop Name</label>
            <input
              type="text"
              value={settings.shopName}
              onChange={(e) => updateSetting('shopName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
              onFocus={(e) => {
                e.target.style.borderColor = '#9e7f57';
                e.target.style.boxShadow = '0 0 0 3px rgba(158, 127, 87, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e6ddd4';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => updateSetting('tagline', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ 
                focusRingColor: '#9e7f57',
                borderColor: '#e6ddd4'
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Language</label>
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ 
                focusRingColor: '#9e7f57',
                borderColor: '#e6ddd4'
              }}
            >
              <option value="en">English</option>
              <option value="ne">नेपाली (Nepali)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => updateSetting('timezone', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ 
                focusRingColor: '#9e7f57',
                borderColor: '#e6ddd4'
              }}
            >
              <option value="Asia/Kathmandu">Asia/Kathmandu</option>
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// Business Settings Component
function BusinessSettings({ settings, updateSetting, updateNestedSetting }: { settings: any, updateSetting: (key: string, value: any) => void, updateNestedSetting: (section: string, key: string, value: any) => void }) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-lg font-semibold mb-6 flex items-center" style={{ color: '#6d5238' }}>
          <Coffee className="w-5 h-5 mr-2" />
          Business Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Business Name</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => updateSetting('name', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Address</label>
            <textarea
              value={settings.address}
              onChange={(e) => updateSetting('address', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Phone</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => updateSetting('phone', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => updateSetting('email', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-lg font-semibold mb-6 flex items-center" style={{ color: '#6d5238' }}>
          <Clock className="w-5 h-5 mr-2" />
          Working Hours
        </h3>
        
        <div className="space-y-4">
          {days.map(day => (
            <div key={day} className="flex items-center space-x-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(158, 127, 87, 0.05)' }}>
              <div className="w-24">
                <span className="text-sm font-medium capitalize" style={{ color: '#6d5238' }}>{day}</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={!settings.workingHours[day].closed}
                  onChange={(e) => updateNestedSetting('workingHours', day, { ...settings.workingHours[day], closed: !e.target.checked })}
                  className="w-4 h-4 rounded focus:ring-2"
                  style={{ color: '#9e7f57' }}
                />
                <span className="text-sm" style={{ color: '#9e7f57' }}>Open</span>
              </div>
              {!settings.workingHours[day].closed && (
                <>
                  <input
                    type="time"
                    value={settings.workingHours[day].open}
                    onChange={(e) => updateNestedSetting('workingHours', day, { ...settings.workingHours[day], open: e.target.value })}
                    className="p-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <span style={{ color: '#9e7f57' }}>to</span>
                  <input
                    type="time"
                    value={settings.workingHours[day].close}
                    onChange={(e) => updateNestedSetting('workingHours', day, { ...settings.workingHours[day], close: e.target.value })}
                    className="p-2 border border-gray-300 rounded-lg text-sm"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Payment Settings Component
function PaymentSettings({ settings, updateSetting, updateNestedSetting }: { settings: any, updateSetting: (key: string, value: any) => void, updateNestedSetting: (section: string, key: string, value: any) => void }) {
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    name: '',
    type: 'digital',
    merchantId: '',
    qrCode: '',
    icon: '💳',
    enabled: true
  });
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string>('');

  const handleQrCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrCodeFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setQrCodePreview(result);
        setNewPaymentMethod(prev => ({ ...prev, qrCode: result }));
      };
      reader.readAsDataURL(file);
      toast.success('QR Code uploaded successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleAddPaymentMethod = () => {
    if (!newPaymentMethod.name.trim()) {
      toast.error('Please enter a payment method name', {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    const methodKey = newPaymentMethod.name.toLowerCase().replace(/\s+/g, '_');
    
    // Check if method already exists
    if (settings.methods[methodKey]) {
      toast.error('Payment method already exists', {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    updateNestedSetting('methods', methodKey, {
      enabled: newPaymentMethod.enabled,
      merchantId: newPaymentMethod.merchantId,
      qrCode: newPaymentMethod.qrCode,
      icon: newPaymentMethod.icon,
      type: newPaymentMethod.type,
      name: newPaymentMethod.name
    });

    // Reset form
    setNewPaymentMethod({
      name: '',
      type: 'digital',
      merchantId: '',
      qrCode: '',
      icon: '💳',
      enabled: true
    });
    setQrCodeFile(null);
    setQrCodePreview('');
    setShowAddPaymentMethod(false);

    toast.success('Payment method added successfully!', {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleDeletePaymentMethod = (methodKey: string) => {
    const updatedMethods = { ...settings.methods };
    delete updatedMethods[methodKey];
    updateSetting('methods', updatedMethods);
    
    toast.success('Payment method removed successfully!', {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const getPaymentMethodIcon = (method: string) => {
    const icons: { [key: string]: string } = {
      cash: '💵',
      card: '💳',
      esewa: '🅴',
      khalti: '🇰',
      fonepay: '📱',
      paypal: '🅿️',
      default: '💳'
    };
    return icons[method] || icons.default;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-lg font-semibold mb-6 flex items-center" style={{ color: '#6d5238' }}>
          <CreditCard className="w-5 h-5 mr-2" />
          Payment Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => updateSetting('currency', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
            >
              <option value="NPR">NPR (Nepalese Rupee)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="INR">INR (Indian Rupee)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Tax Rate (%)</label>
            <input
              type="number"
              value={settings.taxRate}
              onChange={(e) => updateSetting('taxRate', Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
              min="0"
              max="100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Service Charge (%)</label>
            <input
              type="number"
              value={settings.serviceCharge}
              onChange={(e) => updateSetting('serviceCharge', Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>

      {/* Payment Methods Management */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/50">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold flex items-center" style={{ color: '#6d5238' }}>
            <Smartphone className="w-5 h-5 mr-2" />
            Payment Methods
          </h4>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddPaymentMethod(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Payment Method</span>
          </motion.button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Object.entries(settings.methods).map(([method, config]: [string, any]) => (
            <motion.div 
              key={method} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                config.enabled 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{config.icon || getPaymentMethodIcon(method)}</span>
                  <div>
                    <span className="font-medium capitalize" style={{ color: '#6d5238' }}>
                      {config.name || method}
                    </span>
                    <p className="text-xs" style={{ color: '#9e7f57' }}>
                      {config.type || 'digital'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateNestedSetting('methods', method, { ...config, enabled: !config.enabled })}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      config.enabled 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {config.enabled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeletePaymentMethod(method)}
                    className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center transition-all hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              
              {config.enabled && (
                <div className="space-y-2">
                  {config.merchantId && (
                    <input
                      type="text"
                      value={config.merchantId}
                      onChange={(e) => updateNestedSetting('methods', method, { ...config, merchantId: e.target.value })}
                      placeholder="Merchant ID"
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ borderColor: '#e6ddd4' }}
                    />
                  )}
                  
                  {config.qrCode && (
                    <div className="mt-2">
                      <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        {config.qrCode.startsWith('data:') ? (
                          <img 
                            src={config.qrCode} 
                            alt="QR Code" 
                            className="h-20 w-20 object-contain rounded"
                          />
                        ) : (
                          <div className="text-center">
                            <span className="text-sm" style={{ color: '#9e7f57' }}>QR Code: {config.qrCode}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Add New Payment Method Modal */}
        {showAddPaymentMethod && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold" style={{ color: '#6d5238' }}>
                  Add New Payment Method
                </h3>
                <button
                  onClick={() => setShowAddPaymentMethod(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" style={{ color: '#9e7f57' }} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>
                    Payment Method Name
                  </label>
                  <input
                    type="text"
                    value={newPaymentMethod.name}
                    onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Stripe, Razorpay, Local Bank"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ borderColor: '#e6ddd4' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>
                    Type
                  </label>
                  <select
                    value={newPaymentMethod.type}
                    onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ borderColor: '#e6ddd4' }}
                  >
                    <option value="digital">Digital Wallet</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="card">Card Payment</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={newPaymentMethod.icon}
                    onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="💳 🏦 📱"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ borderColor: '#e6ddd4' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>
                    Merchant ID / Account ID
                  </label>
                  <input
                    type="text"
                    value={newPaymentMethod.merchantId}
                    onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, merchantId: e.target.value }))}
                    placeholder="Enter merchant or account ID"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ borderColor: '#e6ddd4' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>
                    QR Code
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#9e7f57] transition-colors">
                        <Upload className="w-4 h-4" style={{ color: '#9e7f57' }} />
                        <span className="text-sm" style={{ color: '#9e7f57' }}>Upload QR Code</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleQrCodeUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-sm text-gray-500">or</span>
                      <input
                        type="text"
                        value={newPaymentMethod.qrCode.startsWith('data:') ? '' : newPaymentMethod.qrCode}
                        onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, qrCode: e.target.value }))}
                        placeholder="Enter QR code text"
                        className="flex-1 p-2 text-sm border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    {qrCodePreview && (
                      <div className="flex justify-center">
                        <img 
                          src={qrCodePreview} 
                          alt="QR Code Preview" 
                          className="h-24 w-24 object-contain border border-gray-200 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newPaymentMethod.enabled}
                      onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="w-4 h-4 rounded focus:ring-2"
                      style={{ color: '#9e7f57' }}
                    />
                    <span className="text-sm" style={{ color: '#6d5238' }}>Enable immediately</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddPaymentMethod(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddPaymentMethod}
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 100%)'
                  }}
                >
                  Add Method
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// General Settings Component
function GeneralSettings({ settings, updateSetting }: { settings: any, updateSetting: (key: string, value: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-lg font-semibold mb-6 flex items-center" style={{ color: '#6d5238' }}>
          <Store className="w-5 h-5 mr-2" />
          Shop Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Shop Name</label>
            <input
              type="text"
              value={settings.shopName}
              onChange={(e) => updateSetting('shopName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => updateSetting('tagline', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Language</label>
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
            >
              <option value="en">English</option>
              <option value="ne">नेपाली</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => updateSetting('timezone', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
            >
              <option value="Asia/Kathmandu">Asia/Kathmandu</option>
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Date Format</label>
            <select
              value={settings.dateFormat}
              onChange={(e) => updateSetting('dateFormat', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Time Format</label>
            <select
              value={settings.timeFormat}
              onChange={(e) => updateSetting('timeFormat', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
            >
              <option value="24h">24 Hour</option>
              <option value="12h">12 Hour</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// Business Settings Component
function BusinessSettings({ settings, updateSetting, updateNestedSetting }: { settings: any, updateSetting: (key: string, value: any) => void, updateNestedSetting: (section: string, key: string, value: any) => void }) {
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-lg font-semibold mb-6 flex items-center" style={{ color: '#6d5238' }}>
          <Coffee className="w-5 h-5 mr-2" />
          Business Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Business Name</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => updateSetting('name', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Phone</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => updateSetting('phone', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => updateSetting('email', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Website</label>
            <input
              type="url"
              value={settings.website}
              onChange={(e) => updateSetting('website', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Address</label>
          <textarea
            value={settings.address}
            onChange={(e) => updateSetting('address', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
            style={{ borderColor: '#e6ddd4' }}
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Tax Number</label>
            <input
              type="text"
              value={settings.taxNumber}
              onChange={(e) => updateSetting('taxNumber', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Registration Number</label>
            <input
              type="text"
              value={settings.registrationNumber}
              onChange={(e) => updateSetting('registrationNumber', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/50">
        <h4 className="text-lg font-semibold mb-4 flex items-center" style={{ color: '#6d5238' }}>
          <Clock className="w-5 h-5 mr-2" />
          Working Hours
        </h4>
        
        <div className="space-y-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex items-center space-x-4">
              <div className="w-24">
                <span className="text-sm font-medium capitalize" style={{ color: '#6d5238' }}>{day}</span>
              </div>
              <input
                type="checkbox"
                checked={!settings.workingHours[day].closed}
                onChange={(e) => updateNestedSetting('workingHours', day, { ...settings.workingHours[day], closed: !e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <input
                type="time"
                value={settings.workingHours[day].open}
                onChange={(e) => updateNestedSetting('workingHours', day, { ...settings.workingHours[day], open: e.target.value })}
                disabled={settings.workingHours[day].closed}
                className="p-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              />
              <span className="text-gray-500">to</span>
              <input
                type="time"
                value={settings.workingHours[day].close}
                onChange={(e) => updateNestedSetting('workingHours', day, { ...settings.workingHours[day], close: e.target.value })}
                disabled={settings.workingHours[day].closed}
                className="p-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              />
              {settings.workingHours[day].closed && (
                <span className="text-red-500 text-sm">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Notification Settings Component
function NotificationSettings({ settings, updateNestedSetting }: { settings: any, updateNestedSetting: (section: string, key: string, value: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-lg font-semibold mb-6 flex items-center" style={{ color: '#6d5238' }}>
          <Bell className="w-5 h-5 mr-2" />
          System Notifications
        </h3>
        
        <div className="space-y-4">
          {Object.entries(settings.system).map(([key, config]: [string, any]) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgba(158, 127, 87, 0.05)' }}>
              <div>
                <span className="font-medium capitalize" style={{ color: '#6d5238' }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                {config.threshold && (
                  <p className="text-sm" style={{ color: '#9e7f57' }}>Threshold: {config.threshold}</p>
                )}
              </div>
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => updateNestedSetting('system', key, { ...config, enabled: e.target.checked })}
                className="w-4 h-4 rounded focus:ring-2"
                style={{ color: '#9e7f57' }}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-lg font-semibold mb-6 flex items-center" style={{ color: '#6d5238' }}>
          <Smartphone className="w-5 h-5 mr-2" />
          Notification Channels
        </h3>
        
        <div className="space-y-4">
          {Object.entries(settings.channels).map(([channel, enabled]: [string, any]) => (
            <div key={channel} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgba(158, 127, 87, 0.05)' }}>
              <span className="font-medium capitalize" style={{ color: '#6d5238' }}>
                {channel.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => updateNestedSetting('channels', channel, e.target.checked)}
                className="w-4 h-4 rounded focus:ring-2"
                style={{ color: '#9e7f57' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Appearance Settings Component
function AppearanceSettings({ settings, updateSetting }: { settings: any, updateSetting: (key: string, value: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-lg font-semibold mb-6 flex items-center" style={{ color: '#6d5238' }}>
          <Palette className="w-5 h-5 mr-2" />
          Theme & Display
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: '#6d5238' }}>Theme</label>
            <div className="flex space-x-3">
              {['light', 'dark', 'auto'].map(theme => (
                <button
                  key={theme}
                  onClick={() => updateSetting('theme', theme)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                    settings.theme === theme ? 'border-[#9e7f57] bg-[#9e7f57] text-white' : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {theme === 'light' && <Sun className="w-4 h-4" />}
                  {theme === 'dark' && <Moon className="w-4 h-4" />}
                  {theme === 'auto' && <Monitor className="w-4 h-4" />}
                  <span className="capitalize">{theme}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: '#6d5238' }}>Font Size</label>
            <select
              value={settings.fontSize}
              onChange={(e) => updateSetting('fontSize', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#e6ddd4' }}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-3" style={{ color: '#6d5238' }}>Interface Options</label>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span style={{ color: '#6d5238' }}>Enable Animations</span>
                <input
                  type="checkbox"
                  checked={settings.animations}
                  onChange={(e) => updateSetting('animations', e.target.checked)}
                  className="w-4 h-4 rounded focus:ring-2"
                  style={{ color: '#9e7f57' }}
                />
              </label>
              <label className="flex items-center justify-between">
                <span style={{ color: '#6d5238' }}>Sound Effects</span>
                <input
                  type="checkbox"
                  checked={settings.soundEffects}
                  onChange={(e) => updateSetting('soundEffects', e.target.checked)}
                  className="w-4 h-4 rounded focus:ring-2"
                  style={{ color: '#9e7f57' }}
                />
              </label>
              <label className="flex items-center justify-between">
                <span style={{ color: '#6d5238' }}>Compact Mode</span>
                <input
                  type="checkbox"
                  checked={settings.compactMode}
                  onChange={(e) => updateSetting('compactMode', e.target.checked)}
                  className="w-4 h-4 rounded focus:ring-2"
                  style={{ color: '#9e7f57' }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Security Settings Component
function SecuritySettings({ settings, updateSetting, updateNestedSetting }: { settings: any, updateSetting: (key: string, value: any) => void, updateNestedSetting: (section: string, key: string, value: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-lg font-semibold mb-6 flex items-center" style={{ color: '#6d5238' }}>
          <Shield className="w-5 h-5 mr-2" />
          Security Settings
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => updateSetting('sessionTimeout', Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                style={{ borderColor: '#e6ddd4' }}
                min="5"
                max="480"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Max Login Attempts</label>
              <input
                type="number"
                value={settings.loginAttempts}
                onChange={(e) => updateSetting('loginAttempts', Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                style={{ borderColor: '#e6ddd4' }}
                min="3"
                max="10"
              />
            </div>
          </div>
          
          <div>
            <label className="flex items-center justify-between">
              <span style={{ color: '#6d5238' }}>Two-Factor Authentication</span>
              <input
                type="checkbox"
                checked={settings.twoFactor}
                onChange={(e) => updateSetting('twoFactor', e.target.checked)}
                className="w-4 h-4 rounded focus:ring-2"
                style={{ color: '#9e7f57' }}
              />
            </label>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-lg font-semibold mb-6 flex items-center" style={{ color: '#6d5238' }}>
          <Database className="w-5 h-5 mr-2" />
          Data Backup
        </h3>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span style={{ color: '#6d5238' }}>Enable Automatic Backup</span>
            <input
              type="checkbox"
              checked={settings.dataBackup.enabled}
              onChange={(e) => updateNestedSetting('dataBackup', 'enabled', e.target.checked)}
              className="w-4 h-4 rounded focus:ring-2"
              style={{ color: '#9e7f57' }}
            />
          </label>
          
          {settings.dataBackup.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Backup Frequency</label>
                <select
                  value={settings.dataBackup.frequency}
                  onChange={(e) => updateNestedSetting('dataBackup', 'frequency', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>Retention (days)</label>
                <input
                  type="number"
                  value={settings.dataBackup.retention}
                  onChange={(e) => updateNestedSetting('dataBackup', 'retention', Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  min="7"
                  max="365"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Advanced Settings Component
function AdvancedSettings({ settings, updateSetting }: { settings: any, updateSetting: (key: string, value: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-lg font-semibold mb-6 flex items-center" style={{ color: '#6d5238' }}>
          <SettingsIcon className="w-5 h-5 mr-2" />
          Advanced Configuration
        </h3>
        
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Advanced Settings Warning</p>
                <p className="text-sm text-yellow-700 mt-1">
                  These settings are for advanced users only. Incorrect configuration may affect system performance.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>API Rate Limit (req/hour)</label>
              <input
                type="number"
                value={settings.apiRateLimit}
                onChange={(e) => updateSetting('apiRateLimit', Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                style={{ borderColor: '#e6ddd4' }}
                min="100"
                max="10000"
              />
            </div>
            
            <div>
              <label className="flex items-center justify-between">
                <span style={{ color: '#6d5238' }}>Debug Mode</span>
                <input
                  type="checkbox"
                  checked={settings.debugMode}
                  onChange={(e) => updateSetting('debugMode', e.target.checked)}
                  className="w-4 h-4 rounded focus:ring-2"
                  style={{ color: '#9e7f57' }}
                />
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span style={{ color: '#6d5238' }}>Enable Caching</span>
              <input
                type="checkbox"
                checked={settings.cacheEnabled}
                onChange={(e) => updateSetting('cacheEnabled', e.target.checked)}
                className="w-4 h-4 rounded focus:ring-2"
                style={{ color: '#9e7f57' }}
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span style={{ color: '#6d5238' }}>Compression</span>
              <input
                type="checkbox"
                checked={settings.compressionEnabled}
                onChange={(e) => updateSetting('compressionEnabled', e.target.checked)}
                className="w-4 h-4 rounded focus:ring-2"
                style={{ color: '#9e7f57' }}
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span style={{ color: '#6d5238' }}>Analytics</span>
              <input
                type="checkbox"
                checked={settings.analyticsEnabled}
                onChange={(e) => updateSetting('analyticsEnabled', e.target.checked)}
                className="w-4 h-4 rounded focus:ring-2"
                style={{ color: '#9e7f57' }}
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span style={{ color: '#6d5238' }}>Error Reporting</span>
              <input
                type="checkbox"
                checked={settings.errorReporting}
                onChange={(e) => updateSetting('errorReporting', e.target.checked)}
                className="w-4 h-4 rounded focus:ring-2"
                style={{ color: '#9e7f57' }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}