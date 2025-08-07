import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, AlertTriangle, Package, TrendingDown, TrendingUp } from 'lucide-react';
import { useData } from '../context/DataContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function Inventory() {
  const { inventory, updateInventory } = useData();
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValue, setEditValue] = useState(0);

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
  const wellStockedItems = inventory.filter(item => item.currentStock > item.minStock);

  const handleUpdateStock = (id: string, newQuantity: number) => {
    updateInventory(id, newQuantity);
    setEditingItem(null);
    toast.success('Stock updated successfully!');
  };

  const getStockStatus = (item: any) => {
    const percentage = (item.currentStock / item.minStock) * 100;
    if (percentage <= 100) return { color: 'text-red-600', bg: 'bg-red-100', status: 'Critical' };
    if (percentage <= 200) return { color: 'text-yellow-600', bg: 'bg-yellow-100', status: 'Low' };
    return { color: 'text-green-600', bg: 'bg-green-100', status: 'Good' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
          <p className="text-gray-600">Track and manage your ingredient stock levels</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-green-400 text-white rounded-lg hover:from-amber-500 hover:to-green-500 transition-all transform hover:scale-105">
          <Plus className="w-5 h-5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Items</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{inventory.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          delay={0.1}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Low Stock Items</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{lowStockItems.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          delay={0.2}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Well Stocked</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{wellStockedItems.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">Low Stock Alert</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg border border-red-200">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    Critical
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Current: {item.currentStock} {item.unit}
                </p>
                <p className="text-sm text-gray-600">
                  Min Required: {item.minStock} {item.unit}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Item Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Current Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Min Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Unit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Updated</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventory.map((item) => {
                const status = getStockStatus(item);
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-green-400 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingItem === item.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            min="0"
                            step="0.1"
                          />
                          <button
                            onClick={() => handleUpdateStock(item.id, editValue)}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="text-gray-600 hover:text-gray-700 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">
                            {item.currentStock} {item.unit}
                          </span>
                          <button
                            onClick={() => {
                              setEditingItem(item.id);
                              setEditValue(item.currentStock);
                            }}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.minStock} {item.unit}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.unit}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.bg} ${status.color}`}>
                        {status.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {format(item.lastUpdated, 'MMM dd, HH:mm')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateStock(item.id, item.currentStock + 1)}
                          className="flex items-center space-x-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                        >
                          <TrendingUp className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStock(item.id, Math.max(0, item.currentStock - 1))}
                          className="flex items-center space-x-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        >
                          <TrendingDown className="w-3 h-3" />
                          <span>Use</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}