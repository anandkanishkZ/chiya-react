import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Clock,
  Users,
  ShoppingBag,
  CreditCard,
  ArrowRight,
  X,
  Merge,
  CheckCircle,
  AlertCircle,
  Search,
  Minus,
  MapPin
} from 'lucide-react';
import { useData } from '../context/DataContext';
import ShiftTableModal from '../components/ShiftTableModal';
import toast from 'react-hot-toast';

export default function TableManagement() {
  const {
    tables,
    menuItems,
    addOrderToTable,
    removeOrderFromTable,
    mergeTables,
    unmergeTables,
    shiftTable,
    checkoutTable
  } = useData();

  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showViewOrdersModal, setShowViewOrdersModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{[key: string]: number}>({});
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [checkoutData, setCheckoutData] = useState({
    paymentMethod: 'cash',
    discount: 0,
    notes: ''
  });
  const [tablesToMerge, setTablesToMerge] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'occupied' | 'merged'>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');

  // Initialize active category
  useEffect(() => {
    if (menuItems.length > 0 && !activeCategory) {
      setActiveCategory(menuItems[0].category);
    }
  }, [menuItems, activeCategory]);

  // Filtered menu items based on category and search
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = !activeCategory || item.category === activeCategory;
      const matchesSearch = !searchTerm || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch && item.available;
    });
  }, [menuItems, activeCategory, searchTerm]);

  const selectedTableData = tables.find(t => t.id === selectedTable);

  // Get available tables for shifting (excluding current selected table)
  const availableTablesForShift = useMemo(() => {
    return tables.filter(table => 
      table.id !== selectedTable && 
      table.status === 'available'
    );
  }, [tables, selectedTable]);

  // Enhanced filtering and search
  const filteredTables = useMemo(() => {
    return tables.filter(table => {
      const matchesSearch = table.number.toString().includes(searchTerm) ||
                           table.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           table.order.some(item => item.menuItem.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || table.status === statusFilter;
      const matchesArea = areaFilter === 'all' || table.area === areaFilter;
      return matchesSearch && matchesStatus && matchesArea;
    });
  }, [tables, searchTerm, statusFilter, areaFilter]);

  // Enhanced statistics
  const tableStats = useMemo(() => {
    const stats = tables.reduce((acc, table) => {
      acc[table.status]++;
      if (table.status === 'occupied') {
        acc.totalRevenue += table.order.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
        acc.totalOrders += table.order.length;
      }
      return acc;
    }, { available: 0, occupied: 0, merged: 0, totalRevenue: 0, totalOrders: 0 });
    
    return stats;
  }, [tables]);

  // Get unique areas
  const areas = useMemo(() => {
    return Array.from(new Set(tables.map(table => table.area)));
  }, [tables]);

  const handleAddOrder = () => {
    if (!selectedTable) {
      toast.error('Please select a table first');
      return;
    }

    if (Object.values(selectedItems).every(qty => qty === 0)) {
      toast.error('Please select at least one item');
      return;
    }

    try {
      let itemsAdded = 0;
      Object.entries(selectedItems).forEach(([menuId, quantity]) => {
        if (quantity > 0) {
          const menuItem = menuItems.find(m => m.id === menuId);
          if (menuItem) {
            addOrderToTable(selectedTable, {
              id: `order-item-${Date.now()}-${menuId}-${Math.random()}`,
              menuItem,
              quantity
            });
            itemsAdded++;
          }
        }
      });

      if (itemsAdded > 0) {
        setSelectedItems({});
        setShowOrderModal(false);
        toast.success(`${itemsAdded} items added to table successfully!`);
      } else {
        toast.error('Failed to add items');
      }
    } catch (error) {
      console.error('Error adding items:', error);
      toast.error('Error adding items to table');
    }
  };

  const handleCheckout = () => {
    if (!selectedTable) return;

    checkoutTable(selectedTable, checkoutData.paymentMethod, checkoutData.discount);
    setShowCheckoutModal(false);
    setSelectedTable(null);
    setCheckoutData({ paymentMethod: 'cash', discount: 0, notes: '' });
    toast.success('Table checked out successfully!');
  };

  const handleMerge = () => {
    if (!selectedTable || tablesToMerge.length === 0) return;

    mergeTables(selectedTable, tablesToMerge);
    setShowMergeModal(false);
    setTablesToMerge([]);
    toast.success('Tables merged successfully!');
  };

  const handleUnmerge = () => {
    if (!selectedTable) return;

    unmergeTables(selectedTable);
    setSelectedTable(null);
    toast.success('Tables unmerged successfully!');
  };

  const handleShift = async (sourceTableId: string, targetTableId: string) => {
    try {
      shiftTable(sourceTableId, targetTableId);
      // Add a small delay for better UX feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      setSelectedTable(null);
      toast.success('Table shifted successfully!');
    } catch (error) {
      toast.error('Failed to shift table. Please try again.');
      throw error; // Re-throw to let the modal handle the error state
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-800 bg-green-200 border-green-300';
      case 'occupied':
        return 'text-amber-800 bg-amber-200 border-amber-300';
      case 'merged':
        return 'text-purple-800 bg-purple-200 border-purple-300';
      default:
        return 'text-gray-800 bg-gray-200 border-gray-300';
    }
  };

  const formatDuration = (startTime: Date) => {
    const minutes = Math.floor((Date.now() - startTime.getTime()) / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Table Management</h2>
            <p className="text-gray-600 mt-1">Manage orders, merge tables, and handle checkouts efficiently</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">Available</p>
                  <p className="text-lg font-bold text-green-900">{tableStats.available}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Occupied</p>
                  <p className="text-lg font-bold text-amber-900">{tableStats.occupied}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Merge className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-800">Merged</p>
                  <p className="text-lg font-bold text-purple-900">{tableStats.merged}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Revenue</p>
                  <p className="text-lg font-bold text-blue-900">₹{tableStats.totalRevenue}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tables, items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="merged">Merged</option>
            </select>
            
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Areas</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Enhanced Professional Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredTables.map((table) => {
            const totalAmount = table.order.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
            const isMerged = table.status === 'merged';
            const isMainMerged = isMerged && table.mergeType === 'main';
            
            return (
              <motion.div
                key={table.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ 
                  scale: 1.01, 
                  y: -3,
                  transition: { 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30,
                    duration: 0.15
                  }
                }}
                whileTap={{ 
                  scale: 0.99,
                  transition: { duration: 0.1 }
                }}
                className={`relative rounded-2xl p-4 cursor-pointer transition-all duration-300 ease-out shadow-lg hover:shadow-xl border bg-white transform-gpu ${
                  table.status === 'available' 
                    ? 'border-green-200 hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50/30 hover:to-green-100/15' 
                    : table.status === 'occupied'
                    ? 'border-orange-200 hover:border-orange-300 hover:bg-gradient-to-br hover:from-orange-50/30 hover:to-orange-100/15'
                    : isMainMerged
                    ? 'border-purple-200 hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-50/30 hover:to-purple-100/15'
                    : 'border-orange-200 hover:border-orange-300 hover:bg-gradient-to-br hover:from-orange-50/30 hover:to-orange-100/15'
                } ${selectedTable === table.id ? 'ring-2 ring-blue-400 border-blue-300 shadow-xl transform scale-[1.01] bg-blue-50/15' : ''}`}
                style={{
                  willChange: 'transform, box-shadow',
                  backfaceVisibility: 'hidden',
                  perspective: '1000px'
                }}
                onClick={() => setSelectedTable(table.id)}
              >
                {/* Professional Header with Enhanced Design */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                        table.status === 'available' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                        table.status === 'occupied' ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-purple-500 to-purple-600'
                      }`}
                      whileHover={{ 
                        scale: 1.05, 
                        rotate: 2,
                        transition: { 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 25,
                          duration: 0.2
                        }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Users className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Table {table.number}</h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        {table.area}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    {/* Checkbox for selection */}
                    <motion.input 
                      type="checkbox" 
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-2 border-gray-300 transition-all duration-200 hover:border-blue-400 hover:scale-110" 
                      checked={selectedTable === table.id}
                      onChange={() => {}}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    />
                    
                    {/* Duration for occupied tables */}
                    {table.status === 'occupied' && table.startTime && (
                      <div className="flex items-center text-xs text-gray-600 bg-orange-50 px-2.5 py-1.5 rounded-lg border border-orange-200">
                        <Clock className="w-3.5 h-3.5 mr-1 text-orange-500" />
                        <span className="font-medium">{formatDuration(table.startTime)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Status Badge with Orders Count */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1">
                    {isMerged ? (
                      <div>
                        {isMainMerged ? (
                          <div className="bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-200 rounded-lg p-3">
                            <div className="text-xs font-semibold text-purple-800 flex items-center mb-1">
                              <Merge className="w-3.5 h-3.5 mr-1.5" />
                              Merged (Main)
                            </div>
                            <div className="text-xs text-purple-600">
                              With: {table.mergedWith?.map(id => {
                                const mergedTable = tables.find(t => t.id === id);
                                return mergedTable?.number;
                              }).join(', ')}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-200 rounded-lg p-3">
                            <div className="text-xs font-semibold text-orange-800 flex items-center mb-1">
                              <ArrowRight className="w-3.5 h-3.5 mr-1.5" />
                              Merged (Secondary)
                            </div>
                            <div className="text-xs text-orange-600">
                              Main: {tables.find(t => t.id === table.mainTableId)?.number}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold ${
                        table.status === 'available' 
                          ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200' 
                          : 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border border-orange-200'
                      }`}>
                        <div className={`w-2.5 h-2.5 rounded-full mr-2 ${
                          table.status === 'available' ? 'bg-green-500' : 'bg-orange-500'
                        }`}></div>
                        {table.status === 'available' ? 'Available' : 'Occupied'}
                      </span>
                    )}
                  </div>
                  
                  {/* Orders count positioned to the right */}
                  <div className="text-center ml-3">
                    <div className="text-xs text-gray-500 mb-1">Orders</div>
                    <div className="text-lg font-bold text-gray-900">{table.order.length}</div>
                  </div>
                </div>

                {/* Clean Current Bill Section */}
                {totalAmount > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-semibold text-gray-700">Current Bill</div>
                      <div className="text-lg font-bold text-green-600">₹{totalAmount}</div>
                    </div>
                    
                    {table.order.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-medium text-gray-500">Recent Orders</div>
                          {table.order.length > 2 && (
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTable(table.id);
                                setShowViewOrdersModal(true);
                              }}
                              whileHover={{ 
                                scale: 1.05,
                                backgroundColor: "rgb(219 234 254)",
                                transition: { duration: 0.2 }
                              }}
                              whileTap={{ scale: 0.95 }}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded transition-all duration-200"
                            >
                              View All ({table.order.length})
                            </motion.button>
                          )}
                        </div>
                        <div className="space-y-1">
                          {table.order.slice(0, 2).map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-xs">
                              <span className="text-gray-600">{item.quantity}× {item.menuItem.name}</span>
                              <span className="font-semibold text-gray-900">₹{item.quantity * item.menuItem.price}</span>
                            </div>
                          ))}
                          {table.order.length > 2 && (
                            <div className="text-xs text-gray-400 text-center py-0.5">
                              +{table.order.length - 2} more items
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Clean Footer Actions */}
                <div className="border-t border-gray-100 pt-3 mt-3">
                  {table.status === 'available' && (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTable(table.id);
                        setShowOrderModal(true);
                      }}
                      whileHover={{ 
                        scale: 1.01, 
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)",
                        transition: { duration: 0.15 }
                      }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Start Order</span>
                    </motion.button>
                  )}

                  {table.status === 'occupied' && (
                    <div className="space-y-2">
                      {/* Primary Actions Row */}
                      <div className="flex space-x-2">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTable(table.id);
                            setShowOrderModal(true);
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            backgroundColor: "rgb(219 234 254)",
                            borderColor: "rgb(147 197 253)",
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Item</span>
                        </motion.button>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTable(table.id);
                            setShowShiftModal(true);
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            backgroundColor: "rgb(237 233 254)",
                            borderColor: "rgb(196 181 253)",
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-purple-50 hover:bg-purple-100 border border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-1.5"
                        >
                          <ArrowRight className="w-4 h-4" />
                          <span>Shift</span>
                        </motion.button>
                      </div>
                      
                      {/* Secondary Actions Row */}
                      <div className="flex space-x-2">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTable(table.id);
                            setShowMergeModal(true);
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            backgroundColor: "rgb(255 237 213)",
                            borderColor: "rgb(253 186 116)",
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-orange-50 hover:bg-orange-100 border border-orange-200 hover:border-orange-300 text-orange-700 hover:text-orange-800 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-1.5"
                        >
                          <Merge className="w-4 h-4" />
                          <span>Merge</span>
                        </motion.button>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTable(table.id);
                            setShowCheckoutModal(true);
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)",
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-md"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Checkout</span>
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {isMainMerged && (
                    <div className="space-y-2">
                      {/* Add Item - Full Width Primary */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTable(table.id);
                          setShowOrderModal(true);
                        }}
                        className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Item</span>
                      </button>
                      
                      {/* Action Grid */}
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTable(table.id);
                            setShowMergeModal(true);
                          }}
                          className="bg-orange-50 hover:bg-orange-100 border border-orange-200 hover:border-orange-300 text-orange-700 hover:text-orange-800 py-2 px-1 rounded-lg text-xs font-semibold transition-all duration-200 flex flex-col items-center justify-center space-y-1"
                        >
                          <Merge className="w-3.5 h-3.5" />
                          <span>Merge</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnmerge();
                          }}
                          className="bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 text-red-700 hover:text-red-800 py-2 px-1 rounded-lg text-xs font-semibold transition-all duration-200 flex flex-col items-center justify-center space-y-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Unmerge</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTable(table.id);
                            setShowCheckoutModal(true);
                          }}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-1 rounded-lg text-xs font-semibold transition-all duration-200 flex flex-col items-center justify-center space-y-1 shadow-md hover:shadow-lg"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Checkout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Enhanced Table Actions */}
      {selectedTable && selectedTableData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${selectedTableData.status === 'available' ? 'bg-green-400' : selectedTableData.status === 'occupied' ? 'bg-amber-400' : 'bg-purple-400'}`}></div>
              <h3 className="text-xl font-semibold text-gray-900">
                Table {selectedTableData.number} Management
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTableData.status)}`}>
                {selectedTableData.status.charAt(0).toUpperCase() + selectedTableData.status.slice(1)}
              </span>
            </div>
            <button
              onClick={() => setSelectedTable(null)}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stats */}
          {selectedTableData.order.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <ShoppingBag className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">{selectedTableData.order.length}</div>
                <div className="text-sm text-blue-700">Items</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <CreditCard className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">
                  ₹{selectedTableData.order.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)}
                </div>
                <div className="text-sm text-green-700">Total</div>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-amber-900">
                  {selectedTableData.startTime ? formatDuration(selectedTableData.startTime) : '0m'}
                </div>
                <div className="text-sm text-amber-700">Duration</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <button
              onClick={() => setShowMergeModal(true)}
              disabled={selectedTableData.status === 'available'}
              className="flex flex-col items-center space-y-2 p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Merge className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-purple-800">Merge Tables</span>
            </button>

            <button
              onClick={() => setShowShiftModal(true)}
              disabled={selectedTableData.status === 'available'}
              className="flex flex-col items-center space-y-2 p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <ArrowRight className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-indigo-800">Shift Table</span>
            </button>

            <button
              onClick={() => setShowOrderModal(true)}
              className="flex flex-col items-center space-y-2 p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all duration-200 group"
            >
              <Plus className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-blue-800">Add Items</span>
            </button>

            <button
              onClick={() => setShowCheckoutModal(true)}
              disabled={selectedTableData.order.length === 0}
              className="flex flex-col items-center space-y-2 p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <CreditCard className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-green-800">Checkout</span>
            </button>
          </div>

          {/* Enhanced Current Order */}
          {selectedTableData.order.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Current Order</h4>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {selectedTableData.order.length} items
                </span>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {selectedTableData.order.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.menuItem.name}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-sm text-gray-600">
                          Qty: <span className="font-medium">{item.quantity}</span> × ₹{item.menuItem.price}
                        </p>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {item.menuItem.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-bold text-green-600 text-lg">₹{item.quantity * item.menuItem.price}</div>
                      </div>
                      <button
                        onClick={() => removeOrderFromTable(selectedTable, item.id)}
                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center bg-green-50 p-4 rounded-xl">
                  <span className="text-lg font-semibold text-gray-900">Order Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{selectedTableData.order.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {selectedTableData.order.length === 0 && (
            <div className="text-center py-8">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-500 mb-2">No items ordered yet</h4>
              <p className="text-gray-400 mb-4">Add items to start this table's order</p>
              <button
                onClick={() => setShowOrderModal(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add First Item</span>
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Professional Add Order Modal - Completely Redesigned */}
      {showOrderModal && selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl modal-container-fixed overflow-hidden"
            style={{ 
              display: 'grid',
              gridTemplateColumns: (Object.values(selectedItems).some(qty => qty > 0) || (selectedTableData?.order.length || 0) > 0)
                ? '320px 1fr 320px' 
                : '320px 1fr',
              transition: 'grid-template-columns 0.3s ease-in-out'
            }}
          >
            {/* Left Sidebar - Menu Categories */}
            <div 
              className="border-r border-gray-200 flex flex-col"
              style={{ backgroundColor: '#faf9f7' }}
            >
              {/* Header */}
              <div 
                className="p-6 border-b"
                style={{ 
                  borderColor: 'rgba(158, 127, 87, 0.2)',
                  background: 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 50%, #76603d 100%)'
                }}
              >
                <h3 className="text-xl font-bold text-white">
                  Add Items - Table {selectedTableData?.number}
                </h3>
                <p className="text-white/80 text-sm mt-1">
                  Select items from our menu
                </p>
                
                {/* Search */}
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent text-sm text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="flex-1 overflow-y-auto p-4 modal-scroll">
                <div className="space-y-2">
                  {Array.from(new Set(menuItems.map(item => item.category))).map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeCategory === category
                          ? 'text-white shadow-md'
                          : 'bg-white hover:bg-white/80 text-gray-700 hover:shadow-sm'
                      }`}
                      style={{
                        background: activeCategory === category 
                          ? 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 100%)'
                          : undefined
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category}</span>
                        <span 
                          className={`text-xs px-2 py-1 rounded-full ${
                            activeCategory === category 
                              ? 'bg-white/20 text-white' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {menuItems.filter(item => item.category === category).length}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Content - Menu Items */}
            <div className="flex-1 flex flex-col bg-white">
              {/* Header with Close Button */}
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{activeCategory}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span>{filteredMenuItems.length} items available</span>
                    {(selectedTableData?.order.length || 0) > 0 && (
                      <span className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{selectedTableData?.order.length} items already ordered</span>
                      </span>
                    )}
                    {Object.values(selectedItems).some(qty => qty > 0) && (
                      <span className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#9e7f57' }}></div>
                        <span>{Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0)} new items selected</span>
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowOrderModal(false);
                    setSelectedItems({});
                    setActiveCategory(menuItems[0]?.category || '');
                  }}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Items Grid */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 modal-scroll">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                  {filteredMenuItems.map((item) => {
                    // Check if this item is already in the current order
                    const isInCurrentOrder = selectedTableData?.order.some(orderItem => orderItem.menuItem.id === item.id);
                    const currentOrderQuantity = selectedTableData?.order
                      .filter(orderItem => orderItem.menuItem.id === item.id)
                      .reduce((sum, orderItem) => sum + orderItem.quantity, 0) || 0;
                      
                    return (
                    <motion.div
                      key={item.id}
                      layout
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`bg-white border rounded-lg p-3 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md relative menu-item-compact ${
                        selectedItems[item.id] > 0
                          ? 'shadow-md border-2'
                          : isInCurrentOrder
                          ? 'border-blue-300 bg-blue-50/30'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{
                        borderColor: selectedItems[item.id] > 0 ? '#9e7f57' : 
                                   isInCurrentOrder ? '#93c5fd' : undefined,
                        backgroundColor: selectedItems[item.id] > 0 ? 'rgba(158, 127, 87, 0.03)' : 
                                       isInCurrentOrder ? 'rgba(59, 130, 246, 0.05)' : undefined
                      }}
                      onClick={() => setSelectedItems(prev => ({
                        ...prev,
                        [item.id]: (prev[item.id] || 0) + 1
                      }))}
                    >
                      {/* Already ordered indicator */}
                      {isInCurrentOrder && (
                        <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                          {currentOrderQuantity} in order
                        </div>
                      )}

                      {/* Selection Badge */}
                      {selectedItems[item.id] > 0 && (
                        <div 
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md z-10"
                          style={{ backgroundColor: '#9e7f57' }}
                        >
                          {selectedItems[item.id]}
                        </div>
                      )}

                      {/* Item Content */}
                      <div className="space-y-2">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                          <h5 className="font-semibold text-gray-900 text-sm leading-tight flex-1 pr-2">
                            {item.name}
                          </h5>
                          <p 
                            className="text-sm font-bold whitespace-nowrap" 
                            style={{ color: '#9e7f57' }}
                          >
                            ₹{item.price}
                          </p>
                        </div>

                        {/* Description - Compact */}
                        {item.description && (
                          <p className="text-gray-600 text-xs leading-tight line-clamp-1">
                            {item.description}
                          </p>
                        )}

                        {/* Quantity Controls - Cleaner Design */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItems(prev => ({
                                  ...prev,
                                  [item.id]: Math.max(0, (prev[item.id] || 0) - 1)
                                }));
                              }}
                              disabled={!selectedItems[item.id]}
                              className="w-6 h-6 bg-gray-100 hover:bg-red-100 disabled:bg-gray-50 disabled:text-gray-300 rounded flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors text-xs"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            
                            <span className="w-6 text-center font-medium text-gray-900 text-sm">
                              {selectedItems[item.id] || 0}
                            </span>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItems(prev => ({
                                  ...prev,
                                  [item.id]: (prev[item.id] || 0) + 1
                                }));
                              }}
                              className="w-6 h-6 rounded flex items-center justify-center text-white transition-colors"
                              style={{ backgroundColor: '#9e7f57' }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#8a6d4a';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#9e7f57';
                              }}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Subtotal */}
                          {selectedItems[item.id] > 0 && (
                            <div className="text-right">
                              <span 
                                className="text-xs font-bold"
                                style={{ color: '#9e7f57' }}
                              >
                                ₹{(selectedItems[item.id] || 0) * item.price}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                    );
                  })}
                </div>

                {/* Empty State */}
                {filteredMenuItems.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                    <p className="text-gray-500">Try adjusting your search or category filter</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowOrderModal(false);
                      setSelectedItems({});
                      setActiveCategory(menuItems[0]?.category || '');
                    }}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddOrder}
                    disabled={Object.values(selectedItems).every(qty => qty === 0)}
                    className="flex-1 py-2.5 px-6 text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    style={{
                      background: Object.values(selectedItems).some(qty => qty > 0) 
                        ? 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 100%)' 
                        : '#d1d5db'
                    }}
                    onMouseEnter={(e) => {
                      if (!Object.values(selectedItems).every(qty => qty === 0)) {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #8a6d4a 0%, #76603d 100%)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!Object.values(selectedItems).every(qty => qty === 0)) {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 100%)';
                      }
                    }}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      Add {Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0)} Items
                      {Object.values(selectedItems).some(qty => qty > 0) && (
                        <span className="ml-2 opacity-90">
                          (₹{Object.entries(selectedItems).reduce((sum, [menuId, quantity]) => {
                            const item = menuItems.find(m => m.id === menuId);
                            return sum + (item ? item.price * quantity : 0);
                          }, 0)})
                        </span>
                      )}
                      {(selectedTableData?.order.length || 0) > 0 && Object.values(selectedItems).some(qty => qty > 0) && (
                        <span className="block text-xs opacity-75 mt-1">
                          Total will be: ₹{(selectedTableData?.order.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0) || 0) + 
                            Object.entries(selectedItems).reduce((sum, [menuId, quantity]) => {
                              const item = menuItems.find(m => m.id === menuId);
                              return sum + (item ? item.price * quantity : 0);
                            }, 0)}
                        </span>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Current Order & Existing Orders */}
            <AnimatePresence>
              {(Object.values(selectedItems).some(qty => qty > 0) || (selectedTableData?.order.length || 0) > 0) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ 
                    type: "spring", 
                    damping: 25, 
                    stiffness: 300
                  }}
                  className="border-l border-gray-200 flex flex-col overflow-hidden"
                  style={{ backgroundColor: '#faf9f7' }}
                >
                {/* Header */}
                <div 
                  className="p-4 border-b"
                  style={{ 
                    borderColor: 'rgba(158, 127, 87, 0.2)',
                    background: 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 100%)'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white">Order Summary</h4>
                    {Object.values(selectedItems).some(qty => qty > 0) && (
                      <button
                        onClick={() => setSelectedItems({})}
                        className="text-white/80 hover:text-white text-xs font-medium px-2 py-1 rounded transition-colors"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                      >
                        Clear New
                      </button>
                    )}
                  </div>
                  <div className="text-white/80 text-xs">
                    {((selectedTableData?.order.length || 0) + Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0))} items total
                  </div>
                </div>

                {/* Unified Items List */}
                <div className="flex-1 overflow-y-auto p-3 modal-scroll">
                  <div className="space-y-2">
                    {/* Existing Orders */}
                    {selectedTableData?.order.map((orderItem) => (
                      <motion.div
                        key={orderItem.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg p-3 shadow-sm border-2 border-blue-300"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h6 className="font-medium text-gray-900 text-xs leading-tight flex-1 pr-1">
                            {orderItem.menuItem.name}
                          </h6>
                          <div className="flex space-x-1">
                            <div className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-bold">
                              Ordered
                            </div>
                            <button
                              onClick={() => removeOrderFromTable(selectedTable!, orderItem.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                              title="Remove from order"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => {
                                // Decrease quantity by removing and re-adding with less quantity
                                if (orderItem.quantity > 1) {
                                  removeOrderFromTable(selectedTable!, orderItem.id);
                                  // Add back with reduced quantity
                                  setTimeout(() => {
                                    addOrderToTable(selectedTable!, {
                                      id: `order-${Date.now()}`, // Generate new ID
                                      menuItem: orderItem.menuItem,
                                      quantity: orderItem.quantity - 1
                                    });
                                  }, 100);
                                } else {
                                  removeOrderFromTable(selectedTable!, orderItem.id);
                                }
                              }}
                              className="w-5 h-5 bg-gray-100 hover:bg-red-100 rounded flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            
                            <span className="font-medium text-gray-900 min-w-[16px] text-center text-xs">
                              {orderItem.quantity}
                            </span>
                            
                            <button
                              onClick={() => {
                                // Add one more of the same item
                                setSelectedItems(prev => ({
                                  ...prev,
                                  [orderItem.menuItem.id]: (prev[orderItem.menuItem.id] || 0) + 1
                                }));
                              }}
                              className="w-5 h-5 bg-blue-100 hover:bg-blue-200 rounded flex items-center justify-center text-blue-600 transition-colors"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xs text-gray-500">₹{orderItem.menuItem.price} each</div>
                            <div className="font-bold text-xs text-blue-600">
                              ₹{orderItem.quantity * orderItem.menuItem.price}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* New Selections */}
                    {Object.entries(selectedItems)
                      .filter(([_, qty]) => qty > 0)
                      .map(([itemId, quantity]) => {
                        const item = menuItems.find(m => m.id === itemId);
                        if (!item) return null;
                        return (
                          <motion.div
                            key={`new-${itemId}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg p-3 shadow-sm border-2"
                            style={{ borderColor: '#9e7f57' }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h6 className="font-medium text-gray-900 text-xs leading-tight flex-1 pr-1">
                                {item.name}
                              </h6>
                              <div className="flex space-x-1">
                                <div 
                                  className="text-xs text-white px-1.5 py-0.5 rounded-full font-bold"
                                  style={{ backgroundColor: '#9e7f57' }}
                                >
                                  Adding
                                </div>
                                <button
                                  onClick={() => setSelectedItems(prev => ({
                                    ...prev,
                                    [itemId]: 0
                                  }))}
                                  className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => setSelectedItems(prev => ({
                                    ...prev,
                                    [itemId]: Math.max(0, quantity - 1)
                                  }))}
                                  className="w-5 h-5 bg-gray-100 hover:bg-red-100 rounded flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                
                                <span className="font-medium text-gray-900 min-w-[16px] text-center text-xs">
                                  {quantity}
                                </span>
                                
                                <button
                                  onClick={() => setSelectedItems(prev => ({
                                    ...prev,
                                    [itemId]: quantity + 1
                                  }))}
                                  className="w-5 h-5 rounded flex items-center justify-center text-white transition-colors"
                                  style={{ backgroundColor: '#9e7f57' }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#8a6d4a';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#9e7f57';
                                  }}
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-xs text-gray-500">₹{item.price} each</div>
                                <div 
                                  className="font-bold text-xs"
                                  style={{ color: '#9e7f57' }}
                                >
                                  ₹{quantity * item.price}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>

                {/* Order Total */}
                <div 
                  className="p-3 border-t"
                  style={{ 
                    borderColor: 'rgba(158, 127, 87, 0.2)',
                    backgroundColor: 'rgba(158, 127, 87, 0.05)'
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-lg text-green-600">
                      ₹{(selectedTableData?.order.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0) || 0) + 
                        Object.entries(selectedItems).reduce((sum, [menuId, quantity]) => {
                          const item = menuItems.find(m => m.id === menuId);
                          return sum + (item ? item.price * quantity : 0);
                        }, 0)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs mt-1 text-center">
                    {(selectedTableData?.order.length || 0) + Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0)} items total
                  </p>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Enhanced Checkout Modal */}
      {showCheckoutModal && selectedTableData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl p-6 w-full max-w-lg"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">Checkout Table {selectedTableData.number}</h3>
                <p className="text-gray-600">Complete the payment for this order</p>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedTableData.order.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.menuItem.name} × {item.quantity}</span>
                    <span className="font-medium">₹{item.quantity * item.menuItem.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'cash', label: 'Cash', icon: '💵' },
                    { value: 'card', label: 'Card', icon: '💳' },
                    { value: 'qr', label: 'QR Pay', icon: '📱' }
                  ].map((method) => (
                    <button
                      key={method.value}
                      onClick={() => setCheckoutData(prev => ({ ...prev, paymentMethod: method.value }))}
                      className={`p-4 rounded-xl border-2 transition-all text-center hover:scale-105 ${
                        checkoutData.paymentMethod === method.value
                          ? 'border-green-400 bg-green-50 text-green-800'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="text-2xl mb-1">{method.icon}</div>
                      <div className="text-sm font-medium">{method.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Discount Amount (₹)</label>
                <input
                  type="number"
                  value={checkoutData.discount}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, discount: Number(e.target.value) }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  placeholder="Enter discount amount"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Notes (Optional)</label>
                <textarea
                  value={checkoutData.notes}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add any special notes..."
                />
              </div>

              {/* Payment Summary */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-medium">₹{selectedTableData.order.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Discount:</span>
                    <span className="font-medium text-red-600">-₹{checkoutData.discount}</span>
                  </div>
                  <div className="border-t border-green-300 pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{Math.max(0, selectedTableData.order.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0) - checkoutData.discount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 py-3 px-6 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Complete Payment</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Enhanced Merge Tables Modal */}
      {showMergeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Merge className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Merge Tables</h3>
                  <p className="text-sm text-gray-600">Combine orders from multiple tables</p>
                </div>
              </div>
              <button
                onClick={() => setShowMergeModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Table Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-purple-900 mb-2">Main Table: {selectedTableData?.number}</h4>
              <div className="text-sm text-purple-700">
                Current Orders: {selectedTableData?.order.length} items • ₹{selectedTableData?.order.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)}
              </div>
            </div>

            <p className="text-gray-600 mb-4 font-medium">
              Select additional tables to merge:
            </p>

            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {tables
                .filter(t => t.id !== selectedTable && (t.status === 'occupied' || t.status === 'merged'))
                .map(table => {
                  const tableTotal = table.order.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
                  return (
                    <label key={table.id} className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      tablesToMerge.includes(table.id) 
                        ? 'border-purple-300 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-200 hover:bg-purple-25'
                    }`}>
                      <input
                        type="checkbox"
                        checked={tablesToMerge.includes(table.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTablesToMerge(prev => [...prev, table.id]);
                          } else {
                            setTablesToMerge(prev => prev.filter(id => id !== table.id));
                          }
                        }}
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded-lg focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">Table {table.number}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              table.status === 'occupied' 
                                ? 'bg-orange-100 text-orange-700' 
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {table.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">₹{tableTotal}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {table.order.length} items • {table.area} • {table.capacity} seats
                        </div>
                      </div>
                    </label>
                  );
                })}
              {tables.filter(t => t.id !== selectedTable && (t.status === 'occupied' || t.status === 'merged')).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No other occupied tables available to merge</p>
                </div>
              )}
            </div>

            {/* Summary */}
            {tablesToMerge.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h5 className="font-medium text-gray-900 mb-2">Merge Summary:</h5>
                <div className="text-sm text-gray-600">
                  <div>Tables to merge: {tablesToMerge.length + 1} total</div>
                  <div className="font-semibold text-green-600 mt-1">
                    Combined total: ₹{[selectedTableData, ...tables.filter(t => tablesToMerge.includes(t.id))]
                      .reduce((total, table) => {
                        if (!table) return total;
                        return total + table.order.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
                      }, 0)}
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setShowMergeModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleMerge}
                disabled={tablesToMerge.length === 0}
                className="flex-1 py-3 px-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
              >
                <Merge className="w-4 h-4" />
                <span>Merge {tablesToMerge.length + 1} Tables</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* New Shift Table Modal Component */}
      <ShiftTableModal
        isOpen={showShiftModal}
        onClose={() => setShowShiftModal(false)}
        sourceTable={selectedTableData || null}
        availableTables={availableTablesForShift}
        onShift={handleShift}
      />

      {/* View All Orders Modal */}
      {showViewOrdersModal && selectedTable && selectedTableData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Table {selectedTableData.number}</h3>
                <p className="text-gray-600 text-sm">All Current Orders</p>
              </div>
              <button
                onClick={() => setShowViewOrdersModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Summary Header */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Current Bill:</span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{selectedTableData.order.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <span className="text-gray-600">Capacity</span>
                  <p className="font-semibold text-gray-900">{selectedTableData.capacity} seats</p>
                </div>
                <div>
                  <span className="text-gray-600">Orders</span>
                  <p className="font-semibold text-gray-900">{selectedTableData.order.length}</p>
                </div>
                <div>
                  <span className="text-gray-600">Revenue</span>
                  <p className="font-semibold text-green-600">
                    ₹{selectedTableData.order.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable Orders List */}
            <div className="flex-1 overflow-y-auto orders-scroll">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Current Orders:</h4>
              <div className="space-y-3">
                {selectedTableData.order.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.menuItem.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × ₹{item.menuItem.price} each
                      </p>
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs mt-1">
                        {item.menuItem.category}
                      </span>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-bold text-green-600 text-lg">₹{item.quantity * item.menuItem.price}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowViewOrdersModal(false);
                  setShowOrderModal(true);
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowViewOrdersModal(false);
                  setShowShiftModal(true);
                }}
                className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Shift</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowViewOrdersModal(false);
                  setShowCheckoutModal(true);
                }}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Checkout</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}