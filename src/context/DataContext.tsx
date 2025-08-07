import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  description?: string;
}

export interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Table {
  id: string;
  number: number;
  status: 'available' | 'occupied' | 'merged';
  capacity: number;
  area: string;
  order: OrderItem[];
  startTime?: Date;
  mergedWith?: string[];
  mergedFromTables?: string[]; // Tables that were merged into this one
  mergeType?: 'main' | 'secondary'; // For merged tables
  mainTableId?: string; // For secondary merged tables
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'qr';
  discount: number;
  timestamp: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minStock: number;
  lastUpdated: Date;
}

export interface StaffMember {
  id: string;
  name: string;
  position: string;
  isPresent: boolean;
  clockIn?: Date;
  clockOut?: Date;
}

export interface Expense {
  id: string;
  staffId: string;
  category: string;
  amount: number;
  description: string;
  date: Date;
}

interface DataContextType {
  tables: Table[];
  menuItems: MenuItem[];
  orders: Order[];
  inventory: InventoryItem[];
  staff: StaffMember[];
  expenses: Expense[];
  updateTable: (tableId: string, updates: Partial<Table>) => void;
  addOrderToTable: (tableId: string, orderItem: OrderItem) => void;
  removeOrderFromTable: (tableId: string, orderItemId: string) => void;
  mergeTables: (mainTableId: string, tablesToMerge: string[]) => void;
  unmergeTables: (mainTableId: string) => void;
  shiftTable: (fromTableId: string, toTableId: string) => void;
  checkoutTable: (tableId: string, paymentMethod: string, discount: number) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  updateInventory: (id: string, quantity: number) => void;
  markAttendance: (staffId: string, present: boolean) => void;
  clockInOut: (staffId: string, action: 'in' | 'out') => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    // Initialize with sample data
    initializeSampleData();
  }, []);

  const initializeSampleData = () => {
    // Sample tables
    const sampleTables: Table[] = Array.from({ length: 12 }, (_, i) => ({
      id: `table-${i + 1}`,
      number: i + 1,
      status: 'available',
      capacity: i < 4 ? 2 : i < 8 ? 4 : 6, // Mix of 2, 4, and 6 seater tables
      area: i < 6 ? 'Main Area' : i < 10 ? 'Garden Area' : 'VIP Area',
      order: [],
    }));
    setTables(sampleTables);

    // Sample menu items
    const sampleMenu: MenuItem[] = [
      { id: '1', name: 'Masala Chai', category: 'Milk Tea', price: 25, available: true },
      { id: '2', name: 'Cardamom Tea', category: 'Milk Tea', price: 30, available: true },
      { id: '3', name: 'Ginger Tea', category: 'Milk Tea', price: 28, available: true },
      { id: '4', name: 'Plain Black Tea', category: 'Black Tea', price: 20, available: true },
      { id: '5', name: 'Lemon Tea', category: 'Black Tea', price: 25, available: true },
      { id: '6', name: 'Green Tea', category: 'Green Tea', price: 35, available: true },
      { id: '7', name: 'Honey Ginger Tea', category: 'Special', price: 40, available: true },
      { id: '8', name: 'Butter Tea', category: 'Special', price: 45, available: true },
    ];
    setMenuItems(sampleMenu);

    // Sample inventory
    const sampleInventory: InventoryItem[] = [
      { id: '1', name: 'Milk', unit: 'Liter', currentStock: 15, minStock: 5, lastUpdated: new Date() },
      { id: '2', name: 'Tea Leaves', unit: 'Kg', currentStock: 3, minStock: 1, lastUpdated: new Date() },
      { id: '3', name: 'Sugar', unit: 'Kg', currentStock: 8, minStock: 2, lastUpdated: new Date() },
      { id: '4', name: 'Cardamom', unit: 'Gram', currentStock: 200, minStock: 50, lastUpdated: new Date() },
      { id: '5', name: 'Ginger', unit: 'Kg', currentStock: 2, minStock: 0.5, lastUpdated: new Date() },
    ];
    setInventory(sampleInventory);

    // Sample staff
    const sampleStaff: StaffMember[] = [
      { id: '1', name: 'Ram Bahadur', position: 'Manager', isPresent: true, clockIn: new Date() },
      { id: '2', name: 'Sita Devi', position: 'Server', isPresent: true, clockIn: new Date() },
      { id: '3', name: 'Hari Sharma', position: 'Cashier', isPresent: false },
    ];
    setStaff(sampleStaff);
  };

  const updateTable = (tableId: string, updates: Partial<Table>) => {
    setTables(prev => prev.map(table => 
      table.id === tableId ? { ...table, ...updates } : table
    ));
  };

  const addOrderToTable = (tableId: string, orderItem: OrderItem) => {
    setTables(prev => prev.map(table => {
      if (table.id === tableId) {
        const existingItem = table.order.find(item => item.menuItem.id === orderItem.menuItem.id);
        if (existingItem) {
          return {
            ...table,
            order: table.order.map(item =>
              item.menuItem.id === orderItem.menuItem.id
                ? { ...item, quantity: item.quantity + orderItem.quantity }
                : item
            ),
            status: 'occupied' as const,
            startTime: table.startTime || new Date(),
          };
        } else {
          return {
            ...table,
            order: [...table.order, orderItem],
            status: 'occupied' as const,
            startTime: table.startTime || new Date(),
          };
        }
      }
      return table;
    }));
  };

  const removeOrderFromTable = (tableId: string, orderItemId: string) => {
    setTables(prev => prev.map(table => {
      if (table.id === tableId) {
        const newOrder = table.order.filter(item => item.id !== orderItemId);
        return {
          ...table,
          order: newOrder,
          status: newOrder.length === 0 ? 'available' as const : 'occupied' as const,
          startTime: newOrder.length === 0 ? undefined : table.startTime,
        };
      }
      return table;
    }));
  };

  const mergeTables = (mainTableId: string, tablesToMerge: string[]) => {
    setTables(prev => prev.map(table => {
      if (table.id === mainTableId) {
        const mergedOrders = tablesToMerge.reduce((acc, tableId) => {
          const tableToMerge = prev.find(t => t.id === tableId);
          return tableToMerge ? [...acc, ...tableToMerge.order] : acc;
        }, table.order);
        
        return {
          ...table,
          order: mergedOrders,
          status: 'merged' as const,
          mergedWith: tablesToMerge,
          mergeType: 'main' as const,
        };
      } else if (tablesToMerge.includes(table.id)) {
        return {
          ...table,
          order: [],
          status: 'merged' as const,
          startTime: undefined,
          mergeType: 'secondary' as const,
          mainTableId: mainTableId,
        };
      }
      return table;
    }));
  };

  const unmergeTables = (mainTableId: string) => {
    const mainTable = tables.find(t => t.id === mainTableId);
    if (!mainTable || !mainTable.mergedWith) return;

    setTables(prev => prev.map(table => {
      if (table.id === mainTableId) {
        // Keep the main table with all orders but remove merge status
        return {
          ...table,
          status: 'occupied' as const,
          mergedWith: undefined,
          mergeType: undefined,
        };
      } else if (mainTable.mergedWith?.includes(table.id)) {
        // Restore secondary tables to available status
        return {
          ...table,
          order: [],
          status: 'available' as const,
          startTime: undefined,
          mergeType: undefined,
          mainTableId: undefined,
        };
      }
      return table;
    }));
  };

  const shiftTable = (fromTableId: string, toTableId: string) => {
    const fromTable = tables.find(t => t.id === fromTableId);
    if (!fromTable) return;

    setTables(prev => prev.map(table => {
      if (table.id === toTableId) {
        return {
          ...table,
          order: fromTable.order,
          status: 'occupied' as const,
          startTime: fromTable.startTime,
        };
      } else if (table.id === fromTableId) {
        return {
          ...table,
          order: [],
          status: 'available' as const,
          startTime: undefined,
        };
      }
      return table;
    }));
  };

  const checkoutTable = (tableId: string, paymentMethod: string, discount: number) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    const total = table.order.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
    const finalTotal = total - discount;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      tableNumber: table.number,
      items: table.order,
      total: finalTotal,
      status: 'completed',
      paymentMethod: paymentMethod as any,
      discount,
      timestamp: new Date(),
    };

    setOrders(prev => [...prev, newOrder]);
    
    setTables(prev => prev.map(t => 
      t.id === tableId 
        ? { ...t, order: [], status: 'available' as const, startTime: undefined, mergedWith: undefined }
        : t
    ));
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `menu-${Date.now()}`,
    };
    setMenuItems(prev => [...prev, newItem]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const updateInventory = (id: string, quantity: number) => {
    setInventory(prev => prev.map(item => 
      item.id === id 
        ? { ...item, currentStock: quantity, lastUpdated: new Date() }
        : item
    ));
  };

  const markAttendance = (staffId: string, present: boolean) => {
    setStaff(prev => prev.map(member => 
      member.id === staffId 
        ? { ...member, isPresent: present }
        : member
    ));
  };

  const clockInOut = (staffId: string, action: 'in' | 'out') => {
    setStaff(prev => prev.map(member => 
      member.id === staffId 
        ? { 
            ...member, 
            [action === 'in' ? 'clockIn' : 'clockOut']: new Date(),
            isPresent: action === 'in'
          }
        : member
    ));
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `expense-${Date.now()}`,
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  return (
    <DataContext.Provider value={{
      tables,
      menuItems,
      orders,
      inventory,
      staff,
      expenses,
      updateTable,
      addOrderToTable,
      removeOrderFromTable,
      mergeTables,
      unmergeTables,
      shiftTable,
      checkoutTable,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      updateInventory,
      markAttendance,
      clockInOut,
      addExpense,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}