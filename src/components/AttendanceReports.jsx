import React, { useState } from 'react';
import { MdBarChart, MdDateRange, MdDownload, MdPerson, MdTrendingUp, MdTrendingDown, MdFilterList } from 'react-icons/md';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const AttendanceReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const departments = ['All Departments', 'Mathematics', 'English', 'Science', 'History', 'Physical Education'];

  const attendanceData = [
    { id: 1, name: 'John Doe', department: 'Mathematics', present: 22, absent: 3, late: 2, percentage: 88 },
    { id: 2, name: 'Jane Smith', department: 'English', present: 25, absent: 0, late: 2, percentage: 100 },
    { id: 3, name: 'Mike Johnson', department: 'Science', present: 20, absent: 5, late: 2, percentage: 80 },
    { id: 4, name: 'Sarah Wilson', department: 'History', present: 24, absent: 1, late: 2, percentage: 96 },
    { id: 5, name: 'David Brown', department: 'Physical Education', present: 23, absent: 2, late: 2, percentage: 92 }
  ];

  const monthlyStats = {
    totalWorkingDays: 27,
    averageAttendance: 91.2,
    totalStaff: 5,
    perfectAttendance: 1
  };

  const chartData = [
    { month: 'Jan', attendance: 91.2 },
    { month: 'Feb', attendance: 89.5 },
    { month: 'Mar', attendance: 93.1 },
    { month: 'Apr', attendance: 87.8 },
    { month: 'May', attendance: 92.4 },
    { month: 'Jun', attendance: 88.9 }
  ];

  const chartOptions = {
    chart: {
      type: 'areaspline',
      height: 300,
      backgroundColor: 'transparent',
      style: { fontFamily: 'Inter, sans-serif' }
    },
    title: { text: null },
    xAxis: {
      categories: chartData.map(d => d.month),
      labels: { style: { color: '#64748b', fontWeight: '500' } },
      gridLineWidth: 0,
      lineColor: '#e2e8f0'
    },
    yAxis: {
      title: { text: 'Attendance %', style: { color: '#64748b' } },
      labels: { format: '{value}%', style: { color: '#64748b' } },
      max: 100,
      min: 0,
      gridLineColor: '#f1f5f9'
    },
    tooltip: {
      shared: true,
      backgroundColor: '#1e293b',
      style: { color: '#fff' },
      borderRadius: 12,
      borderWidth: 0,
      valueSuffix: '%'
    },
    plotOptions: {
      areaspline: {
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, 'rgba(59, 130, 246, 0.2)'],
            [1, 'rgba(59, 130, 246, 0)']
          ]
        },
        color: '#3b82f6',
        lineWidth: 3,
        marker: {
          enabled: true,
          radius: 6,
          fillColor: '#fff',
          lineColor: '#3b82f6',
          lineWidth: 2
        }
      }
    },
    series: [{
      name: 'Average Attendance',
      data: chartData.map(d => d.attendance)
    }],
    credits: { enabled: false },
    legend: { enabled: false }
  };

  const handleExportReport = () => {
    // Create CSV content
    const headers = ['Name', 'Department', 'Present Days', 'Absent Days', 'Late Days', 'Attendance %'];
    const csvContent = [
      headers.join(','),
      ...attendanceData.map(row => [
        row.name,
        row.department,
        row.present,
        row.absent,
        row.late,
        row.percentage
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${selectedPeriod}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 95) return 'text-green-600 bg-green-100';
    if (percentage >= 85) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredData = attendanceData.filter(staff => {
    const matchesDept = selectedDepartment === 'all' || staff.department.toLowerCase() === selectedDepartment.toLowerCase();
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.slice(1).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {selectedPeriod === 'custom' && (
              <div className="flex items-center gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Staff</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <button
            onClick={handleExportReport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <MdDownload />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Working Days</p>
              <p className="text-2xl font-bold text-blue-900">{monthlyStats.totalWorkingDays}</p>
            </div>
            <MdDateRange className="text-3xl text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Avg Attendance</p>
              <p className="text-2xl font-bold text-green-900">{monthlyStats.averageAttendance}%</p>
            </div>
            <MdTrendingUp className="text-3xl text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Staff</p>
              <p className="text-2xl font-bold text-purple-900">{monthlyStats.totalStaff}</p>
            </div>
            <MdPerson className="text-3xl text-purple-600" />
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Perfect Attendance</p>
              <p className="text-2xl font-bold text-yellow-900">{monthlyStats.perfectAttendance}</p>
            </div>
            <MdBarChart className="text-3xl text-yellow-600" />
          </div>
        </div>
      </div>
      {/* Detailed Attendance Report */}

        <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Detailed Attendance Report</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MdFilterList />
              <span>Showing {filteredData.length} of {attendanceData.length} staff members</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Late</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((staff) => (
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {staff.present} days
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {staff.absent} days
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {staff.late} days
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAttendanceColor(staff.percentage)}`}>
                      {staff.percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {staff.percentage >= 95 ? (
                        <MdTrendingUp className="text-green-500 mr-1" />
                      ) : staff.percentage >= 85 ? (
                        <MdBarChart className="text-yellow-500 mr-1" />
                      ) : (
                        <MdTrendingDown className="text-red-500 mr-1" />
                      )}
                      <span className="text-sm text-gray-600">
                        {staff.percentage >= 95 ? 'Excellent' : staff.percentage >= 85 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Trend Chart with Highcharts */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trend</h3>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>

    
    </div>
  );
};

export default AttendanceReports;