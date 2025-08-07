import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  Table,
  TrendingUp,
  Clock,
  Package
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useData } from '../context/DataContext';
import { format } from 'date-fns';

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        {change && (
          <p className={`text-sm mt-2 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            {change > 0 ? '+' : ''}{change}%
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const { tables, orders, inventory, staff } = useData();

  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const todayOrders = orders.filter(o => 
    format(o.timestamp, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  ).length;
  const todayRevenue = orders
    .filter(o => format(o.timestamp, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
    .reduce((sum, o) => sum + o.total, 0);
  const lowStockItems = inventory.filter(i => i.currentStock <= i.minStock).length;
  const presentStaff = staff.filter(s => s.isPresent).length;

  // Sample chart data
  const salesData = [
    { name: 'Mon', sales: 2400 },
    { name: 'Tue', sales: 1398 },
    { name: 'Wed', sales: 9800 },
    { name: 'Thu', sales: 3908 },
    { name: 'Fri', sales: 4800 },
    { name: 'Sat', sales: 3800 },
    { name: 'Sun', sales: 4300 },
  ];

  const tableStatusData = [
    { name: 'Available', value: tables.filter(t => t.status === 'available').length, color: '#10B981' },
    { name: 'Occupied', value: occupiedTables, color: '#F59E0B' },
    { name: 'Merged', value: tables.filter(t => t.status === 'merged').length, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Revenue"
          value={`₹${todayRevenue}`}
          change={12.5}
          icon={DollarSign}
          color="bg-gradient-to-br from-green-400 to-green-600"
        />
        <StatCard
          title="Orders Today"
          value={todayOrders}
          change={8.2}
          icon={ShoppingBag}
          color="bg-gradient-to-br from-blue-400 to-blue-600"
        />
        <StatCard
          title="Tables Occupied"
          value={`${occupiedTables}/${tables.length}`}
          icon={Table}
          color="bg-gradient-to-br from-amber-400 to-amber-600"
        />
        <StatCard
          title="Staff Present"
          value={`${presentStaff}/${staff.length}`}
          icon={Users}
          color="bg-gradient-to-br from-purple-400 to-purple-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Table Status Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Table Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tableStatusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {tableStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Low Stock Alerts</h3>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="space-y-3">
            {inventory.filter(item => item.currentStock <= item.minStock).map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-800">{item.name}</p>
                    <p className="text-sm text-amber-600">Current: {item.currentStock} {item.unit}</p>
                  </div>
                </div>
                <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full font-medium">
                  Low Stock
                </span>
              </div>
            ))}
            {inventory.filter(item => item.currentStock <= item.minStock).length === 0 && (
              <p className="text-gray-600 text-center py-4">All items are well stocked!</p>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            {orders.slice(-5).reverse().map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Table {order.tableNumber}</p>
                  <p className="text-sm text-gray-600">{format(order.timestamp, 'HH:mm')}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">₹{order.total}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-gray-600 text-center py-4">No recent orders</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}