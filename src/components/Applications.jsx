import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdFilterList, MdVisibility, MdEdit, MdDelete, MdCheckCircle, MdCancel, MdAppRegistration } from 'react-icons/md';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { studentAPI, classAPI, admissionAPI } from '../utils/apiService';
import { FaSpinner } from 'react-icons/fa';

const Applications = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, [searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await studentAPI.getAll({ 
        search: searchTerm, 
        status: statusFilter === 'all' ? '' : statusFilter 
      });
      const apps = res.data.applications || res.data;
      setApplications(Array.isArray(apps) ? apps : []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      toast.error('Could not access application records');
    } finally {
      setLoading(false);
    }
  };

  const handleAdmissionAction = async (appId, action) => {
    try {
      if (action === 'approve') {
        await studentAPI.verify(appId, { status: 'verified', remarks: 'Application Approved' });
        toast.success('Application approved successfully! ✅');
      } else if (action === 'confirm') {
        await admissionAPI.update(appId, { admissionStatus: 'confirmed' });
        toast.success('Admission confirmed successfully! 🎓');
      } else if (action === 'reject') {
        await studentAPI.verify(appId, { status: 'rejected', remarks: 'Application Rejected' });
        toast.error('Application rejected ❌');
      }
      fetchApplications();
    } catch (err) {
      console.error('Status sync failure:', err);
      toast.error('Failed to update status');
    }
  };

  const handleView = (app) => {
    navigate(`/application-view/${app.admissionNumber || app._id}`);
  };

  const handleEdit = (app) => {
    navigate(`/edit-admission/${app.admissionNumber || app._id}`);
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await admissionAPI.delete(appId);
          Swal.fire('Deleted!', 'Application has been deleted.', 'success');
          fetchApplications();
        } catch (err) {
          console.error('Failed to delete application:', err);
          toast.error('Failed to delete application');
        } finally {
          setLoading(false);
        }
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

  return (
    <div className="space-y-10">
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <FaSpinner className="animate-spin text-blue-500 text-5xl" />
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <MdAppRegistration size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-2 tracking-tight">Applications</h2>
          <p className="text-indigo-200 text-lg font-medium">Manage and review student admission applications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <MdAppRegistration size={24} />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">TOTAL</span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Applications</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{applications.length}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
              <FaSpinner size={24} className="animate-spin-slow" />
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">PENDING</span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending Review</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{applications.filter(app => app.applicationStatus === 'pending').length}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <MdCheckCircle size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">APPROVED</span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Approved Applications</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{applications.filter(app => app.applicationStatus === 'approved').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50 transition-all font-medium"
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white font-bold text-slate-600 appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800">Applications List ({applications.length})</h3>
          <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">Records</span>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <FaSpinner className="animate-spin text-indigo-600" size={48} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Loading Applications...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">App ID</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Info</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Guardian Info</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Class</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.length > 0 ? applications.map((app) => (
                  <tr key={app._id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 text-[10px] font-black text-blue-900 uppercase tracking-tighter">
                      #{app._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-bold text-blue-900">{`${app.firstName || ''} ${app.lastName || ''}`.trim() || 'UNNAMED'}</div>
                        <div className="text-[10px] text-blue-600 font-medium">{app.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-blue-700 font-medium">{app.fatherName}</div>
                      <div className="text-[10px] text-blue-500 font-bold">{app.mobile}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-700 uppercase tracking-widest border border-slate-200">
                        {app.class?.className || 'UNASSIGNED'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        app.admissionStatus === 'confirmed' ? 'bg-emerald-600 text-white shadow-sm' :
                        app.applicationStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' : 
                        app.applicationStatus === 'pending' ? 'bg-orange-100 text-orange-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {app.admissionStatus === 'confirmed' ? 'Confirmed' : app.applicationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-blue-700">
                      {new Date(app.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <div className="relative group">
                          <button 
                            onClick={() => handleView(app)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-blue-50 cursor-pointer"
                          >
                            <MdVisibility size={18} />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded shadow-lg z-50">
                            View Details
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>

                        {/* School Admission Controls - LOCKED if Rejected */}
                        {app.applicationStatus !== 'rejected' && (
                          <>
                            <div className="relative group">
                              <button 
                                onClick={() => handleEdit(app)}
                                className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-50 cursor-pointer"
                              >
                                <MdEdit size={18} />
                              </button>
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded shadow-lg z-50">
                                Edit
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                              </div>
                            </div>
                            
                            {app.applicationStatus === 'pending' && (
                              <div className="relative group">
                                <button 
                                  onClick={() => handleAdmissionAction(app._id, 'approve')}
                                  className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-50 cursor-pointer"
                                >
                                  <MdCheckCircle size={18} />
                                </button>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded shadow-lg z-50">
                                  Approve
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                </div>
                              </div>
                            )}

                            {app.applicationStatus === 'approved' && app.admissionStatus !== 'confirmed' && (
                              <div className="relative group">
                                <button 
                                  onClick={() => handleAdmissionAction(app._id, 'confirm')}
                                  className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors border border-purple-50 cursor-pointer"
                                >
                                  <MdCheckCircle className="rotate-90" size={18} /> 
                                </button>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded shadow-lg z-50">
                                  Confirm Admission
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                </div>
                              </div>
                            )}

                            {(app.applicationStatus === 'pending' || app.applicationStatus === 'approved') && (
                              <div className="relative group">
                                <button 
                                  onClick={() => handleAdmissionAction(app._id, 'reject')}
                                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors border border-red-50 cursor-pointer"
                                >
                                  <MdCancel size={18} />
                                </button>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded shadow-lg z-50">
                                  Reject
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        <div className="relative group">
                          <button 
                            onClick={() => handleDelete(app._id)}
                            className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors border border-rose-50 cursor-pointer"
                          >
                            <MdDelete size={18} />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded shadow-lg z-50">
                            Delete
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                        <MdAppRegistration size={50} className="text-slate-300" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching applications found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Applications</h4>
          <p className="text-3xl font-black text-blue-600 tabular-nums">{applications.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pending Review</h4>
          <p className="text-3xl font-black text-orange-600 tabular-nums">
            {applications.filter(app => app.applicationStatus === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Approved Applications</h4>
          <p className="text-3xl font-black text-emerald-600 tabular-nums">
            {applications.filter(app => app.applicationStatus === 'approved').length}
          </p>
        </div>
      </div>



    </div>
  );
};

export default Applications;
