import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, User, CheckCircle, XCircle, Calendar, Download } from 'lucide-react';
import { useData } from '../context/DataContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function StaffAttendance() {
  const { staff, markAttendance, clockInOut } = useData();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const presentStaff = staff.filter(member => member.isPresent);
  const absentStaff = staff.filter(member => !member.isPresent);

  const handleClockInOut = (staffId: string, action: 'in' | 'out') => {
    clockInOut(staffId, action);
    toast.success(`Successfully clocked ${action}!`);
  };

  const handleAttendanceToggle = (staffId: string, present: boolean) => {
    markAttendance(staffId, present);
    toast.success(`Attendance ${present ? 'marked' : 'unmarked'} successfully!`);
  };

  const getWorkingHours = (member: any) => {
    if (!member.clockIn) return 'Not clocked in';
    
    const clockIn = new Date(member.clockIn);
    const clockOut = member.clockOut ? new Date(member.clockOut) : new Date();
    const diffInMinutes = Math.floor((clockOut.getTime() - clockIn.getTime()) / (1000 * 60));
    
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Staff Attendance</h2>
          <p className="text-gray-600">Track daily attendance and working hours</p>
        </div>
        <div className="flex space-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Staff</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{staff.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
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
              <p className="text-gray-600 text-sm font-medium">Present Today</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{presentStaff.length}</p>
              <p className="text-sm text-gray-500 mt-1">
                {staff.length > 0 ? Math.round((presentStaff.length / staff.length) * 100) : 0}% attendance
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
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
              <p className="text-gray-600 text-sm font-medium">Absent Today</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{absentStaff.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Today's Attendance</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {staff.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    member.isPresent ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <User className={`w-6 h-6 ${
                      member.isPresent ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.position}</p>
                    {member.isPresent && (
                      <div className="flex items-center space-x-4 mt-1">
                        {member.clockIn && (
                          <span className="text-xs text-green-600">
                            In: {format(member.clockIn, 'HH:mm')}
                          </span>
                        )}
                        {member.clockOut && (
                          <span className="text-xs text-red-600">
                            Out: {format(member.clockOut, 'HH:mm')}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          Total: {getWorkingHours(member)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Attendance Status */}
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                      member.isPresent 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {member.isPresent ? 'Present' : 'Absent'}
                    </span>
                    
                    <button
                      onClick={() => handleAttendanceToggle(member.id, !member.isPresent)}
                      className={`p-2 rounded-lg transition-colors ${
                        member.isPresent
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {member.isPresent ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Clock In/Out */}
                  {member.isPresent && (
                    <div className="flex space-x-2">
                      {!member.clockIn && (
                        <button
                          onClick={() => handleClockInOut(member.id, 'in')}
                          className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                        >
                          <Clock className="w-4 h-4" />
                          <span>Clock In</span>
                        </button>
                      )}
                      
                      {member.clockIn && !member.clockOut && (
                        <button
                          onClick={() => handleClockInOut(member.id, 'out')}
                          className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                        >
                          <Clock className="w-4 h-4" />
                          <span>Clock Out</span>
                        </button>
                      )}

                      {member.clockIn && member.clockOut && (
                        <button
                          onClick={() => handleClockInOut(member.id, 'in')}
                          className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                        >
                          <Clock className="w-4 h-4" />
                          <span>Clock In Again</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Staff Member</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Mon</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Tue</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Wed</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Thu</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Fri</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Sat</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Sun</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id} className="border-b border-gray-100">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-green-400 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.position}</p>
                      </div>
                    </div>
                  </td>
                  {[...Array(7)].map((_, dayIndex) => (
                    <td key={dayIndex} className="text-center py-4 px-4">
                      <div className={`w-6 h-6 rounded-full mx-auto ${
                        Math.random() > 0.2 ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}