import React, { useState, useEffect } from 'react';
import { FaCalendar, FaSearch, FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';

const MyAttendanceHistory = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/staff-panel/attendance-staff/my-history');
      
      if (response.data.success) {
        const records = response.data.data || [];
        const formattedRecords = records.map((record, index) => ({
          id: index + 1,
          date: new Date(record.date).toLocaleDateString('en-IN'),
          status: record.status || 'Not Marked',
          checkIn: record.timeIn ? new Date(record.timeIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
          checkOut: record.timeOut ? new Date(record.timeOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
          source: record.source || 'manual'
        }));
        setAttendanceRecords(formattedRecords);
      }
    } catch (error) {
      toast.error('Failed to fetch attendance history');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = attendanceRecords.filter(r =>
    (r.date?.includes(searchTerm)) &&
    (filterStatus === 'all' || r.status?.toLowerCase() === filterStatus.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedData = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return 'bg-green-100 text-green-700';
      case 'absent': return 'bg-red-100 text-red-700';
      case 'late': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <FaSpinner className="animate-spin text-3xl text-blue-600" />
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">My Attendance History</h1>
          <p className="text-sm text-gray-500">View and track your daily presence logs</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Present</p>
                <p className="text-2xl font-bold text-green-600">
                  {attendanceRecords.filter(r => r.status?.toLowerCase() === 'present').length}
                </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Absent</p>
                <p className="text-2xl font-bold text-red-600">
                  {attendanceRecords.filter(r => r.status?.toLowerCase() === 'absent').length}
                </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Attendance %</p>
                <p className="text-2xl font-bold text-blue-600">
                  {attendanceRecords.length > 0 ? ((attendanceRecords.filter(r => r.status?.toLowerCase() === 'present').length / attendanceRecords.length) * 100).toFixed(1) : 0}%
                </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Logs</p>
                <p className="text-2xl font-bold text-gray-800">{attendanceRecords.length}</p>
            </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                placeholder="Search by date (DD/MM/YYYY)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-50 border rounded-lg outline-none"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
        </div>

        {/* List Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">In Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Out Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedData.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-700">{record.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{record.checkIn}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{record.checkOut}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-[10px] font-bold uppercase tracking-wider">
                        {record.source || 'Manual'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
                <p className="text-xs text-gray-500 font-medium">Page {currentPage} of {totalPages}</p>
                <div className="flex gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-2 border rounded-lg bg-white disabled:opacity-50"
                  >
                    <FaChevronLeft />
                  </button>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-2 border rounded-lg bg-white disabled:opacity-50"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MyAttendanceHistory;
