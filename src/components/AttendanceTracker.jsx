import React, { useState, useEffect } from 'react';
import { MdAccessTime, MdCheckCircle, MdCancel, MdPerson, MdLocationOn, MdSchedule } from 'react-icons/md';

const AttendanceTracker = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState('not-marked');
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'John Doe', department: 'Mathematics', status: 'present', checkIn: '09:15 AM', checkOut: null },
    { id: 2, name: 'Jane Smith', department: 'English', status: 'present', checkIn: '09:05 AM', checkOut: null },
    { id: 3, name: 'Mike Johnson', department: 'Science', status: 'absent', checkIn: null, checkOut: null },
    { id: 4, name: 'Sarah Wilson', department: 'History', status: 'late', checkIn: '09:45 AM', checkOut: null },
    { id: 5, name: 'David Brown', department: 'Physical Education', status: 'present', checkIn: '08:55 AM', checkOut: '05:30 PM' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now.toLocaleTimeString());
    setAttendanceStatus('checked-in');
  };

  const handleCheckOut = () => {
    const now = new Date();
    setCheckOutTime(now.toLocaleTimeString());
    setAttendanceStatus('checked-out');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-100';
      case 'absent': return 'text-red-600 bg-red-100';
      case 'late': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <MdCheckCircle className="text-green-600" />;
      case 'absent': return <MdCancel className="text-red-600" />;
      case 'late': return <MdSchedule className="text-yellow-600" />;
      default: return <MdPerson className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Time & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Time</h3>
            <MdAccessTime className="text-2xl text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-sm text-gray-600">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Attendance</h3>
          <div className="space-y-3">
            {checkInTime && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-800">Check In</span>
                <span className="text-sm text-green-600">{checkInTime}</span>
              </div>
            )}
            {checkOutTime && (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-red-800">Check Out</span>
                <span className="text-sm text-red-600">{checkOutTime}</span>
              </div>
            )}
            <div className="flex space-x-3">
              {attendanceStatus === 'not-marked' && (
                <button
                  onClick={handleCheckIn}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <MdCheckCircle />
                  <span>Check In</span>
                </button>
              )}
              {attendanceStatus === 'checked-in' && (
                <button
                  onClick={handleCheckOut}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <MdCancel />
                  <span>Check Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Staff Attendance Overview */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Today's Staff Attendance</h3>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Present: {staffList.filter(s => s.status === 'present').length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">Absent: {staffList.filter(s => s.status === 'absent').length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Late: {staffList.filter(s => s.status === 'late').length}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <MdPerson className="text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                      {getStatusIcon(staff.status)}
                      <span className="ml-1 capitalize">{staff.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {staff.checkIn || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {staff.checkOut || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;