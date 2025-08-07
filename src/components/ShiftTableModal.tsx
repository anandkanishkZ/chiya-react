import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  X,
  MapPin,
  Check,
  Users,
  RefreshCw
} from 'lucide-react';
import { Table } from '../context/DataContext';

interface ShiftTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceTable: Table | null;
  availableTables: Table[];
  onShift: (sourceTableId: string, targetTableId: string) => Promise<void>;
  className?: string;
}

export default function ShiftTableModal({
  isOpen,
  onClose,
  sourceTable,
  availableTables,
  onShift,
  className = ""
}: ShiftTableModalProps) {
  const [selectedTargetTable, setSelectedTargetTable] = useState<string>('');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [isShifting, setIsShifting] = useState(false);

  // Get unique areas for filtering
  const uniqueAreas = useMemo(() => {
    return Array.from(new Set(availableTables.map(table => table.area)));
  }, [availableTables]);

  // Filter tables based on area
  const filteredTables = useMemo(() => {
    return availableTables.filter(table => 
      areaFilter === 'all' || table.area === areaFilter
    );
  }, [availableTables, areaFilter]);

  // Get selected target table data
  const targetTable = availableTables.find(table => table.id === selectedTargetTable);

  // Reset state when modal opens/closes
  const resetState = () => {
    setSelectedTargetTable('');
    setAreaFilter('all');
    setIsShifting(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleShift = async () => {
    if (!sourceTable || !selectedTargetTable) return;
    
    setIsShifting(true);
    try {
      await onShift(sourceTable.id, selectedTargetTable);
      handleClose();
    } catch (error) {
      console.error('Failed to shift table:', error);
    } finally {
      setIsShifting(false);
    }
  };

  if (!isOpen || !sourceTable) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[75vh] overflow-hidden flex flex-col ${className}`}
        >
          {/* Simple Header */}
          <div 
            className="p-6 border-b border-gray-200"
            style={{ 
              background: 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 50%, #76603d 100%)'
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Shift Table {sourceTable.number}
                  </h3>
                  <p className="text-white/80 text-sm">
                    Choose a new table to move orders to
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-hidden flex flex-col">
            {/* Filter Bar */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Available:</span> 
                <span className="ml-1 text-green-600 font-semibold">
                  {filteredTables.length} tables
                </span>
              </div>
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-600 focus:border-transparent bg-white min-w-[140px]"
                style={{ '--tw-ring-color': '#9e7f57' } as any}
              >
                <option value="all">All Areas</option>
                {uniqueAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            {/* Tables Grid - Scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {filteredTables.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Available Tables</h3>
                  <p className="text-gray-500 mb-4">
                    {areaFilter === 'all' 
                      ? "All tables are currently occupied" 
                      : `No tables available in ${areaFilter}`
                    }
                  </p>
                  {areaFilter !== 'all' && (
                    <button
                      onClick={() => setAreaFilter('all')}
                      className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
                      style={{ 
                        background: 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 100%)' 
                      }}
                    >
                      View All Areas
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredTables.map(table => (
                    <motion.div
                      key={table.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedTargetTable === table.id
                          ? 'shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                      }`}
                      style={{
                        borderColor: selectedTargetTable === table.id ? '#9e7f57' : undefined,
                        backgroundColor: selectedTargetTable === table.id ? 'rgba(158, 127, 87, 0.05)' : undefined
                      }}
                      onClick={() => setSelectedTargetTable(table.id)}
                    >
                      {/* Selection Indicator */}
                      {selectedTargetTable === table.id && (
                        <div 
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                          style={{ backgroundColor: '#9e7f57' }}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      {/* Table Info */}
                      <div className="text-center">
                        <div 
                          className="w-14 h-14 rounded-xl flex items-center justify-center mb-3 mx-auto shadow-sm"
                          style={{
                            background: selectedTargetTable === table.id 
                              ? 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 100%)'
                              : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
                          }}
                        >
                          <span className={`font-bold text-lg ${
                            selectedTargetTable === table.id ? 'text-white' : 'text-gray-600'
                          }`}>
                            {table.number}
                          </span>
                        </div>
                        
                        <h5 className="font-semibold text-gray-900 mb-2">Table {table.number}</h5>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center justify-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{table.area}</span>
                          </div>
                          
                          <div className="flex items-center justify-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{table.capacity} seats</span>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                            Available
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Simple Footer - Always visible */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex-shrink-0">
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                style={{ minHeight: '56px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleShift}
                disabled={!selectedTargetTable || isShifting}
                className="flex-1 px-6 py-4 text-white rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                style={{
                  background: selectedTargetTable && !isShifting
                    ? 'linear-gradient(135deg, #9e7f57 0%, #8a6d4a 100%)'
                    : '#d1d5db',
                  minHeight: '56px'
                }}
              >
                {isShifting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Shifting...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>
                      {selectedTargetTable 
                        ? `Shift to Table ${targetTable?.number}` 
                        : 'Select a table first'
                      }
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
