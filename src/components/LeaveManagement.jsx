import React, { useState } from 'react';
import { MdAdd, MdEventNote, MdCheckCircle, MdCancel, MdPending, MdCalendarToday, MdPerson, MdDescription } from 'react-icons/md';

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState('apply');
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      staffName: 'John Doe',
      leaveType: 'Sick Leave',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      days: 3,
      reason: 'Medical treatment required',
      status: 'pending',
      appliedDate: '2024-01-10'
    },
    {
      id: 2,
      staffName: 'Jane Smith',
      leaveType: 'Annual Leave',
      startDate: '2024-01-20',
      endDate: '2024-01-25',
      days: 6,
      reason: 'Family vacation',
      status: 'approved',
      appliedDate: '2024-01-05'
    },
    {
      id: 3,
      staffName: 'Mike Johnson',
      leaveType: 'Emergency Leave',
      startDate: '2024-01-12',
      endDate: '2024-01-12',
      days: 1,
      reason: 'Family emergency',
      status: 'rejected',
      appliedDate: '2024-01-11'
    }
  ]);

  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = request.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const [newLeave, setNewLeave] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const leaveTypes = [
    'Sick Leave',
    'Annual Leave',
    'Maternity Leave',
    'Paternity Leave',
    'Emergency Leave',
    'Casual Leave'
  ];

  const handleSubmitLeave = (e) => {
    e.preventDefault();
    const startDate = new Date(newLeave.startDate);
    const endDate = new Date(newLeave.endDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const leaveRequest = {
      id: leaveRequests.length + 1,
      staffName: 'Current User',
      ...newLeave,
      days,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    setLeaveRequests([leaveRequest, ...leaveRequests]);
    setNewLeave({ leaveType: '', startDate: '', endDate: '', reason: '' });
    setShowLeaveForm(false);
  };

  const handleStatusChange = (id, newStatus) => {
    setLeaveRequests(leaveRequests.map(request =>
      request.id === id ? { ...request, status: newStatus } : request
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <MdCheckCircle className="text-green-600" />;
      case 'rejected': return <MdCancel className="text-red-600" />;
      case 'pending': return <MdPending className="text-yellow-600" />;
      default: return <MdEventNote className="text-gray-600" />;
    }
  };

  const leaveStats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(r => r.status === 'pending').length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    rejected: leaveRequests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      {/* Leave Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Requests</p>
              <p className="text-2xl font-bold text-blue-900">{leaveStats.total}</p>
            </div>
            <MdEventNote className="text-3xl text-blue-600" />
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{leaveStats.pending}</p>
            </div>
            <MdPending className="text-3xl text-yellow-600" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Approved</p>
              <p className="text-2xl font-bold text-green-900">{leaveStats.approved}</p>
            </div>
            <MdCheckCircle className="text-3xl text-green-600" />
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Rejected</p>
              <p className="text-2xl font-bold text-red-900">{leaveStats.rejected}</p>
            </div>
            <MdCancel className="text-3xl text-red-600" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${activeTab === 'apply' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Apply Leave
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${activeTab === 'manage' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Manage Requests
          </button>
        </div>
        {activeTab === 'apply' && (
          <button
            onClick={() => setShowLeaveForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <MdAdd />
            <span>New Leave Request</span>
          </button>
        )}
      </div>

      {/* Leave Application Form */}
      {showLeaveForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Apply for Leave</h3>
            <form onSubmit={handleSubmitLeave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select
                  value={newLeave.leaveType}
                  onChange={(e) => setNewLeave({ ...newLeave, leaveType: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newLeave.startDate}
                    onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newLeave.endDate}
                    onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Please provide reason for leave"
                  required
                ></textarea>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeaveForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {activeTab === 'apply' ? 'My Leave Requests' : 'All Leave Requests'}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Found: {filteredRequests.length} requests</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search staff or leave type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-gray-700"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                {activeTab === 'manage' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <MdPerson className="text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{request.staffName}</div>
                        <div className="text-sm text-gray-500">Applied: {request.appliedDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.leaveType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.startDate} to {request.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.days}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </span>
                  </td>
                  {activeTab === 'manage' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusChange(request.id, 'approved')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(request.id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;