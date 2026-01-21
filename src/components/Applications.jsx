import React, { useState } from 'react';
import { MdSearch, MdFilterList, MdVisibility, MdEdit, MdDelete, MdCheckCircle, MdCancel } from 'react-icons/md';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const [applications, setApplications] = useState([
    {
      id: 'APP001',
      name: 'Rahul Sharma',
      email: 'rahul@email.com',
      phone: ' 9876543210',
      course: 'Class 11 - Science',
      status: 'pending',
      submittedDate: '2024-01-15',
      percentage: '85%'
    },
    {
      id: 'APP002',
      name: 'Priya Singh',
      email: 'priya@email.com',
      phone: ' 9876543211',
      course: 'Class 10',
      status: 'approved',
      submittedDate: '2024-01-14',
      percentage: '92%'
    },
    {
      id: 'APP003',
      name: 'Amit Kumar',
      email: 'amit@email.com',
      phone: ' 9876543212',
      course: 'Class 12 - Commerce',
      status: 'rejected',
      submittedDate: '2024-01-13',
      percentage: '78%'
    },
    {
      id: 'APP004',
      name: 'Sneha Patel',
      email: 'sneha@email.com',
      phone: ' 9876543213',
      course: 'Class 11 - Arts',
      status: 'pending',
      submittedDate: '2024-01-12',
      percentage: '88%'
    },
    {
      id: 'APP005',
      name: 'Vikash Gupta',
      email: 'vikash@email.com',
      phone: ' 9876543214',
      course: 'Class 9',
      status: 'approved',
      submittedDate: '2024-01-11',
      percentage: '90%'
    }
  ]);

  const handleStatusChange = (appId, newStatus) => {
    setApplications(applications.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ));
    toast.success(`Application ${appId} ${newStatus} successfully!`);
  };

  const handleView = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const handleEdit = (app) => {
    setEditingApp(app);
    setEditFormData({ ...app });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    setApplications(applications.map(app => 
      app.id === editingApp.id ? { ...editFormData } : app
    ));
    setShowEditModal(false);
    toast.success(`Application for ${editFormData.name} updated successfully!`);
  };

  const handleEditInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = (appId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setApplications(applications.filter(app => app.id !== appId));
        Swal.fire('Deleted!', 'Application has been deleted.', 'success');
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-white text-blue-600 border border-blue-200';
      case 'rejected':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-white text-blue-600';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 m">
      {/* Header */}
      <div className="bg-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Application Management</h2>
        <p className="text-blue-100">Review and manage student applications</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or application ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-blue-100">
          <h3 className="text-xl font-bold text-blue-900">Applications ({filteredApplications.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Application ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Student Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Course</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Percentage</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Submitted</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-blue-900">{app.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-blue-900">{app.name}</div>
                      <div className="text-sm text-blue-600">{app.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-700">{app.phone}</td>
                  <td className="px-6 py-4 text-sm text-blue-700">{app.course}</td>
                  <td className="px-6 py-4 text-sm font-medium text-blue-900">{app.percentage}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-700">{app.submittedDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleView(app)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <MdVisibility size={18} />
                      </button>
                      <button 
                        onClick={() => handleEdit(app)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit Application"
                      >
                        <MdEdit size={18} />
                      </button>
                      {app.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(app.id, 'approved')}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Approve Application"
                          >
                            <MdCheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(app.id, 'rejected')}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Reject Application"
                          >
                            <MdCancel size={18} />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDelete(app.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete Application"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h4 className="text-lg font-semibold text-blue-900 mb-2">Total Applications</h4>
          <p className="text-3xl font-bold text-blue-600">{applications.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h4 className="text-lg font-semibold text-blue-900 mb-2">Pending Review</h4>
          <p className="text-3xl font-bold text-blue-600">
            {applications.filter(app => app.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h4 className="text-lg font-semibold text-blue-900 mb-2">Approved</h4>
          <p className="text-3xl font-bold text-blue-600">
            {applications.filter(app => app.status === 'approved').length}
          </p>
        </div>
      </div>

      {/* Modal for viewing application details */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Application Details</h3>
            <div className="space-y-3">
              <div><span className="font-medium">Name:</span> {selectedApp.name}</div>
              <div><span className="font-medium">Email:</span> {selectedApp.email}</div>
              <div><span className="font-medium">Phone:</span> {selectedApp.phone}</div>
              <div><span className="font-medium">Course:</span> {selectedApp.course}</div>
              <div><span className="font-medium">Percentage:</span> {selectedApp.percentage}</div>
              <div><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  selectedApp.status === 'approved' ? 'bg-blue-100 text-blue-800' : 
                  selectedApp.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedApp.status.charAt(0).toUpperCase() + selectedApp.status.slice(1)}
                </span>
              </div>
              <div><span className="font-medium">Submitted:</span> {selectedApp.submittedDate}</div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Edit Application</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name || ''}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email || ''}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editFormData.phone || ''}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Course</label>
                <select
                  name="course"
                  value={editFormData.course || ''}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Course</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11 - Science">Class 11 - Science</option>
                  <option value="Class 11 - Commerce">Class 11 - Commerce</option>
                  <option value="Class 11 - Arts">Class 11 - Arts</option>
                  <option value="Class 12 - Science">Class 12 - Science</option>
                  <option value="Class 12 - Commerce">Class 12 - Commerce</option>
                  <option value="Class 12 - Arts">Class 12 - Arts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Percentage</label>
                <input
                  type="text"
                  name="percentage"
                  value={editFormData.percentage || ''}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 85%"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;