import React, { useState, useMemo } from 'react';
import { MdPeople, MdCalendarToday, MdAssignment, MdAdd, MdEdit, MdDelete, MdVisibility, MdFileDownload, MdSearch, MdFilterList } from 'react-icons/md';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Configure Highcharts theme
Highcharts.setOptions({
  colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'],
  chart: {
    backgroundColor: 'transparent',
    style: {
      fontFamily: 'Inter, system-ui, sans-serif'
    }
  },
  title: {
    style: {
      color: '#1F2937',
      fontSize: '18px',
      fontWeight: '600'
    }
  },
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    style: {
      color: '#ffffff'
    },
    borderRadius: 8,
    shadow: true
  }
});

const StaffAttendance = () => {
  const [activeTab, setActiveTab] = useState('leave-management');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showNewLeaveModal, setShowNewLeaveModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showCharts, setShowCharts] = useState(false);
  const [newLeaveForm, setNewLeaveForm] = useState({
    name: '',
    department: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Sample data for Leave Management
  const [leaveData, setLeaveData] = useState([
    { id: 1, name: 'John Doe', department: 'IT', leaveType: 'Sick Leave', startDate: '2024-01-15', endDate: '2024-01-17', days: 3, status: 'Approved', reason: 'Fever and cold' },
    { id: 2, name: 'Jane Smith', department: 'HR', leaveType: 'Annual Leave', startDate: '2024-01-20', endDate: '2024-01-25', days: 5, status: 'Pending', reason: 'Family vacation' },
    { id: 3, name: 'Mike Johnson', department: 'Finance', leaveType: 'Personal Leave', startDate: '2024-01-18', endDate: '2024-01-19', days: 2, status: 'Rejected', reason: 'Personal work' },
    { id: 4, name: 'Sarah Wilson', department: 'Marketing', leaveType: 'Maternity Leave', startDate: '2024-02-01', endDate: '2024-04-01', days: 60, status: 'Approved', reason: 'Maternity' },
    { id: 5, name: 'David Brown', department: 'IT', leaveType: 'Sick Leave', startDate: '2024-01-22', endDate: '2024-01-23', days: 2, status: 'Pending', reason: 'Medical checkup' },
    { id: 6, name: 'Lisa Garcia', department: 'Sales', leaveType: 'Annual Leave', startDate: '2024-01-25', endDate: '2024-01-30', days: 5, status: 'Approved', reason: 'Holiday trip' },
    { id: 7, name: 'Tom Wilson', department: 'IT', leaveType: 'Emergency Leave', startDate: '2024-01-28', endDate: '2024-01-29', days: 2, status: 'Pending', reason: 'Family emergency' }
  ]);

  // Sample data for Attendance Report
  const attendanceData = [
    { id: 1, name: 'John Doe', department: 'IT', present: 22, absent: 3, late: 1, percentage: 88, lastLogin: '09:15 AM' },
    { id: 2, name: 'Jane Smith', department: 'HR', present: 24, absent: 1, late: 0, percentage: 96, lastLogin: '08:45 AM' },
    { id: 3, name: 'Mike Johnson', department: 'Finance', present: 20, absent: 5, late: 2, percentage: 80, lastLogin: '09:30 AM' },
    { id: 4, name: 'Sarah Wilson', department: 'Marketing', present: 25, absent: 0, late: 1, percentage: 100, lastLogin: '08:30 AM' },
    { id: 5, name: 'David Brown', department: 'IT', present: 23, absent: 2, late: 0, percentage: 92, lastLogin: '09:00 AM' },
    { id: 6, name: 'Lisa Garcia', department: 'Sales', present: 21, absent: 4, late: 3, percentage: 84, lastLogin: '09:45 AM' },
    { id: 7, name: 'Tom Wilson', department: 'IT', present: 19, absent: 6, late: 1, percentage: 76, lastLogin: '10:00 AM' }
  ];

  // Filter and search functionality
  const filteredLeaveData = useMemo(() => {
    return leaveData.filter(leave => {
      const matchesSearch = leave.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           leave.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || leave.status.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [leaveData, searchTerm, filterStatus]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLeaveData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeaveData.length / itemsPerPage);

  // Chart options for attendance report
  const chartOptions = useMemo(() => ({
    chart: {
      type: 'column',
      height: 400,
      backgroundColor: 'transparent'
    },
    title: {
      text: 'Staff Attendance Overview',
      style: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#1F2937'
      }
    },
    xAxis: {
      categories: attendanceData.map(item => item.name),
      title: {
        text: 'Staff Members',
        style: {
          color: '#6B7280',
          fontSize: '14px'
        }
      },
      labels: {
        style: {
          color: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    yAxis: {
      title: {
        text: 'Days',
        style: {
          color: '#6B7280',
          fontSize: '14px'
        }
      },
      labels: {
        style: {
          color: '#6B7280',
          fontSize: '12px'
        }
      },
      gridLineColor: '#E5E7EB'
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderRadius: 8,
      style: {
        color: '#ffffff',
        fontSize: '13px'
      },
      formatter: function() {
        const staff = attendanceData.find(s => s.name === this.x);
        return `<b>${this.x}</b><br/>
                <span style="color:${this.color}">●</span> ${this.series.name}: <b>${this.y} days</b><br/>
                Department: <b>${staff.department}</b><br/>
                Attendance: <b>${staff.percentage}%</b><br/>
                Last Login: <b>${staff.lastLogin}</b>`;
      }
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          style: {
            color: '#374151',
            fontSize: '11px',
            fontWeight: '500'
          }
        },
        borderRadius: 4,
        pointPadding: 0.1,
        groupPadding: 0.15
      }
    },
    series: [
      {
        name: 'Present',
        data: attendanceData.map(item => item.present),
        color: '#10B981'
      },
      {
        name: 'Absent',
        data: attendanceData.map(item => item.absent),
        color: '#EF4444'
      },
      {
        name: 'Late',
        data: attendanceData.map(item => item.late),
        color: '#F59E0B'
      }
    ],
    legend: {
      itemStyle: {
        color: '#374151',
        fontSize: '13px'
      }
    },
    credits: {
      enabled: false
    }
  }), [attendanceData]);

  // Pie chart for leave status distribution
  const leaveStatusChart = useMemo(() => ({
    chart: {
      type: 'pie',
      height: 350,
      backgroundColor: 'transparent'
    },
    title: {
      text: 'Leave Status Distribution',
      style: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#1F2937'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderRadius: 8,
      style: {
        color: '#ffffff',
        fontSize: '13px'
      },
      formatter: function() {
        return `<b>${this.point.name}</b><br/>
                Count: <b>${this.y}</b><br/>
                Percentage: <b>${this.percentage.toFixed(1)}%</b>`;
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}%',
          style: {
            color: '#374151',
            fontSize: '12px',
            fontWeight: '500'
          }
        },
        showInLegend: true,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    },
    series: [{
      name: 'Leaves',
      colorByPoint: true,
      data: [
        { 
          name: 'Approved', 
          y: leaveData.filter(l => l.status === 'Approved').length, 
          color: '#10B981',
          sliced: true,
          selected: true
        },
        { 
          name: 'Pending', 
          y: leaveData.filter(l => l.status === 'Pending').length, 
          color: '#F59E0B'
        },
        { 
          name: 'Rejected', 
          y: leaveData.filter(l => l.status === 'Rejected').length, 
          color: '#EF4444'
        }
      ]
    }],
    legend: {
      itemStyle: {
        color: '#374151',
        fontSize: '13px'
      }
    },
    credits: {
      enabled: false
    }
  }), [leaveData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 95) return 'bg-green-100 text-green-800';
    if (percentage >= 85) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleLeaveAction = (id, action) => {
    setLeaveData(prev => prev.map(leave => 
      leave.id === id ? { ...leave, status: action } : leave
    ));
  };

  const handleViewLeave = (leave) => {
    setSelectedLeave(leave);
    setShowLeaveModal(true);
  };

  const handleNewLeaveSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!newLeaveForm.name) errors.name = 'Name is required';
    if (!newLeaveForm.department) errors.department = 'Department is required';
    if (!newLeaveForm.leaveType) errors.leaveType = 'Leave type is required';
    if (!newLeaveForm.startDate) errors.startDate = 'Start date is required';
    if (!newLeaveForm.endDate) errors.endDate = 'End date is required';
    if (!newLeaveForm.reason) errors.reason = 'Reason is required';
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      const start = new Date(newLeaveForm.startDate);
      const end = new Date(newLeaveForm.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      
      const newLeave = {
        id: leaveData.length + 1,
        ...newLeaveForm,
        days,
        status: 'Pending'
      };
      
      setLeaveData(prev => [...prev, newLeave]);
      setShowNewLeaveModal(false);
      setNewLeaveForm({ name: '', department: '', leaveType: '', startDate: '', endDate: '', reason: '' });
      setFormErrors({});
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewLeaveForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const exportToCSV = (data, filename) => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(data[0]).join(",") + "\n" +
      data.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderPagination = () => (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-700">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLeaveData.length)} of {filteredLeaveData.length} entries
      </div>
      <div className="flex space-x-1">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 text-sm border rounded ${
              currentPage === index + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderLeaveModal = () => (
    showLeaveModal && selectedLeave && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Leave Details</h3>
            <button
              onClick={() => setShowLeaveModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="space-y-3">
            <div><strong>Name:</strong> {selectedLeave.name}</div>
            <div><strong>Department:</strong> {selectedLeave.department}</div>
            <div><strong>Leave Type:</strong> {selectedLeave.leaveType}</div>
            <div><strong>Start Date:</strong> {selectedLeave.startDate}</div>
            <div><strong>End Date:</strong> {selectedLeave.endDate}</div>
            <div><strong>Days:</strong> {selectedLeave.days}</div>
            <div><strong>Reason:</strong> {selectedLeave.reason}</div>
            <div>
              <strong>Status:</strong>
              <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedLeave.status)}`}>
                {selectedLeave.status}
              </span>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            {selectedLeave.status === 'Pending' && (
              <>
                <button
                  onClick={() => {
                    handleLeaveAction(selectedLeave.id, 'Approved');
                    setShowLeaveModal(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    handleLeaveAction(selectedLeave.id, 'Rejected');
                    setShowLeaveModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </>
            )}
            <button
              onClick={() => setShowLeaveModal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );

  const renderLeaveManagement = () => (
    <div className="space-y-6">
      {/* Leave Status Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <HighchartsReact
          highcharts={Highcharts}
          options={leaveStatusChart}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Leave Management</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => exportToCSV(leaveData, 'leave_data.csv')}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 flex items-center space-x-1"
            >
              <MdFileDownload />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowNewLeaveModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center space-x-1"
            >
              <MdAdd />
              <span>New Leave</span>
            </button>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="flex space-x-4 mb-4">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, department, or leave type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <MdFilterList className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{leave.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.leaveType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.startDate} to {leave.endDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.days}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewLeave(leave)}
                        className="text-blue-600 hover:text-blue-900 p-1" title="View Details"
                      >
                        <MdVisibility />
                      </button>
                      {leave.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleLeaveAction(leave.id, 'Approved')}
                            className="text-green-600 hover:text-green-900 p-1" title="Approve"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => handleLeaveAction(leave.id, 'Rejected')}
                            className="text-red-600 hover:text-red-900 p-1" title="Reject"
                          >
                            ✗
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderPagination()}
      </div>
    </div>
  );

  const renderAttendanceReport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Detailed Attendance Report</h3>
          <button
            onClick={() => exportToCSV(attendanceData, 'attendance_report.csv')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center space-x-1"
          >
            <MdFileDownload />
            <span>Export Report</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Late</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceData.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{staff.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{staff.present}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{staff.absent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">{staff.late}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAttendanceColor(staff.percentage)}`}>
                      {staff.percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.lastLogin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 p-1" title="View Details">
                      <MdVisibility />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">
          Staff Attendance Management
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">View:</span>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="leave-management">Leave Management</option>
            <option value="attendance-report">Attendance Report</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <MdPeople size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold">{attendanceData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <MdCalendarToday size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Present Today</p>
              <p className="text-2xl font-bold">{attendanceData.filter(s => s.percentage >= 95).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg mr-4">
              <MdAssignment size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Leaves</p>
              <p className="text-2xl font-bold">{leaveData.filter(l => l.status === 'Pending').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg mr-4">
              <MdCalendarToday size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Low Attendance</p>
              <p className="text-2xl font-bold">{attendanceData.filter(s => s.percentage < 85).length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-200 mb-6"></div>

      {/* Content based on selected tab */}
      {activeTab === 'leave-management' ? renderLeaveManagement() : renderAttendanceReport()}
      
      {/* Modals */}
      {renderLeaveModal()}
      {showNewLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <MdAdd className="text-white text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white">New Leave Request</h3>
                </div>
                <button 
                  onClick={() => setShowNewLeaveModal(false)} 
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Form */}
            <form onSubmit={handleNewLeaveSubmit} className="p-6 space-y-5">
              {/* Staff Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Staff Name *</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="name" 
                    value={newLeaveForm.name} 
                    onChange={handleFormChange} 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter staff name"
                  />
                  <MdPeople className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {formErrors.name && <p className="text-red-500 text-sm flex items-center space-x-1"><span>⚠</span><span>{formErrors.name}</span></p>}
              </div>
              
              {/* Department */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Department *</label>
                <select 
                  name="department" 
                  value={newLeaveForm.department} 
                  onChange={handleFormChange} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white"
                >
                  <option value="">Select Department</option>
                  <option value="IT">IT Department</option>
                  <option value="HR">Human Resources</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                </select>
                {formErrors.department && <p className="text-red-500 text-sm flex items-center space-x-1"><span>⚠</span><span>{formErrors.department}</span></p>}
              </div>
              
              {/* Leave Type */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Leave Type *</label>
                <select 
                  name="leaveType" 
                  value={newLeaveForm.leaveType} 
                  onChange={handleFormChange} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white"
                >
                  <option value="">Select Leave Type</option>
                  <option value="Sick Leave">🩹 Sick Leave</option>
                  <option value="Annual Leave">🏖️ Annual Leave</option>
                  <option value="Personal Leave">💼 Personal Leave</option>
                  <option value="Emergency Leave">🆘 Emergency Leave</option>
                  <option value="Maternity Leave">👶 Maternity Leave</option>
                  <option value="Paternity Leave">👨‍👩‍👶 Paternity Leave</option>
                </select>
                {formErrors.leaveType && <p className="text-red-500 text-sm flex items-center space-x-1"><span>⚠</span><span>{formErrors.leaveType}</span></p>}
              </div>
              
              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Start Date *</label>
                  <input 
                    type="date" 
                    name="startDate" 
                    value={newLeaveForm.startDate} 
                    onChange={handleFormChange} 
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                  {formErrors.startDate && <p className="text-red-500 text-sm flex items-center space-x-1"><span>⚠</span><span>{formErrors.startDate}</span></p>}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">End Date *</label>
                  <input 
                    type="date" 
                    name="endDate" 
                    value={newLeaveForm.endDate} 
                    onChange={handleFormChange} 
                    min={newLeaveForm.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                  {formErrors.endDate && <p className="text-red-500 text-sm flex items-center space-x-1"><span>⚠</span><span>{formErrors.endDate}</span></p>}
                </div>
              </div>
              
              {/* Duration Display */}
              {newLeaveForm.startDate && newLeaveForm.endDate && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <MdCalendarToday className="text-blue-600" />
                    <p className="text-sm font-medium text-blue-800">
                      <strong>Duration:</strong> {Math.ceil((new Date(newLeaveForm.endDate) - new Date(newLeaveForm.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
                    </p>
                  </div>
                </div>
              )}
              
              {/* Reason */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Reason *</label>
                <textarea 
                  name="reason" 
                  value={newLeaveForm.reason} 
                  onChange={handleFormChange} 
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 resize-none"
                  placeholder="Please provide a detailed reason for your leave request..."
                />
                {formErrors.reason && <p className="text-red-500 text-sm flex items-center space-x-1"><span>⚠</span><span>{formErrors.reason}</span></p>}
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowNewLeaveModal(false);
                    setFormErrors({});
                    setNewLeaveForm({ name: '', department: '', leaveType: '', startDate: '', endDate: '', reason: '' });
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                >
                  <MdAdd className="text-lg" />
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAttendance;