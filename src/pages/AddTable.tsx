import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Table, Users, MapPin, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AddTable() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '',
    location: '',
    description: '',
    status: 'available'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.tableNumber || !formData.capacity) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Here you would typically save to your backend
    console.log('Adding table:', formData);
    toast.success('Table added successfully!');
    
    // Reset form
    setFormData({
      tableNumber: '',
      capacity: '',
      location: '',
      description: '',
      status: 'available'
    });
  };

  const handleBack = () => {
    navigate('/tables');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg transition-all duration-200"
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
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 
              className="text-3xl font-bold"
              style={{ 
                background: 'linear-gradient(135deg, #9e7f57 0%, #6d5238 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Add New Table
            </h1>
            <p style={{ color: '#9e7f57' }} className="text-sm mt-1">
              Create a new table entry for your restaurant
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200/50"
        style={{
          boxShadow: '0 20px 40px -12px rgba(158, 127, 87, 0.15)'
        }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 100%)'
            }}
          >
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold" style={{ color: '#6d5238' }}>
              Table Information
            </h2>
            <p className="text-sm" style={{ color: '#9e7f57' }}>
              Fill in the details for the new table
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Table Number */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>
                Table Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Table className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#9e7f57' }} />
                <input
                  type="text"
                  name="tableNumber"
                  value={formData.tableNumber}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg transition-all bg-gray-50/50 text-gray-800"
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
                  placeholder="e.g., T-001, Table 1"
                  required
                />
              </div>
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>
                Capacity <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#9e7f57' }} />
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg transition-all bg-gray-50/50 text-gray-800"
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
                  placeholder="Number of seats"
                  min="1"
                  max="20"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#9e7f57' }} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg transition-all bg-gray-50/50 text-gray-800"
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
                  placeholder="e.g., Window side, Center, Patio"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
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
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6d5238' }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
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
              placeholder="Additional notes about the table (optional)"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-200"
              style={{
                color: '#6d5238',
                backgroundColor: 'rgba(158, 127, 87, 0.1)',
                border: '2px solid rgba(158, 127, 87, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(158, 127, 87, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(158, 127, 87, 0.1)';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 50%, #76603d 100%)',
                boxShadow: '0 4px 15px rgba(158, 127, 87, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #8a6d4a 0%, #76603d 50%, #6d5238 100%)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(158, 127, 87, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 50%, #76603d 100%)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(158, 127, 87, 0.3)';
              }}
            >
              <Save className="w-4 h-4" />
              <span>Add Table</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
