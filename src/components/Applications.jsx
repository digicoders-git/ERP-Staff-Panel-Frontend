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
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
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
      toast.error('Could not access application registry');
    } finally {
      setLoading(false);
    }
  };

  const handleAdmissionAction = async (appId, action) => {
    try {
      if (action === 'approve') {
        await studentAPI.verify(appId, { status: 'verified', remarks: 'Institutional Authorization Granted' });
        toast.success('MANIFEST VERIFIED: Identity Authorized! ✅');
      } else if (action === 'confirm') {
        await admissionAPI.update(appId, { admissionStatus: 'confirmed' });
        toast.success('SEAT CONFIRMED: Admission Finalized! 🛡️');
      } else if (action === 'reject') {
        await studentAPI.verify(appId, { status: 'rejected', remarks: 'Admission Petition Denied' });
        toast.error('PETITION SYNCed: Application Rejected ❌');
      }
      fetchApplications();
    } catch (err) {
      console.error('Status sync failure:', err);
      toast.error('Registry Sync Protocol Interrupted');
    }
  };

  const handleView = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const handleEdit = (app) => {
    navigate(`/edit-admission/${app._id}`);
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
          toast.error('System Failure: Deletion Manifest Denied');
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
          <h2 className="text-4xl font-black mb-2 tracking-tight">Application Pipeline</h2>
          <p className="text-indigo-200 text-lg font-medium">Coordinate and authorize new student identities within the institutional registry</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <MdAppRegistration size={24} />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">REGISTRY</span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Applications</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{applications.length}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
              <FaSpinner size={24} className="animate-spin-slow" />
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">ACTION REQ</span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending Adjudication</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{applications.filter(app => app.applicationStatus === 'pending').length}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <MdCheckCircle size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">AUTHORIZED</span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Approved Identities</h3>
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
              <option value="all">All Status Manifests</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Institutional Approved</option>
              <option value="rejected">Rejected Petitions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800">Application Manifest ({applications.length})</h3>
          <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">Institutional Registry</span>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <FaSpinner className="animate-spin text-indigo-600" size={48} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Accessing Registry Matrix...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry ID</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Information</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Guardian Control</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Matrix</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Hub</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Submission Date</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions Terminal</th>
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
                        <button 
                          onClick={() => handleView(app)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-blue-50"
                          title="View Identity Manifest"
                        >
                          <MdVisibility size={18} />
                        </button>

                        {/* Institutional Admission Controls - LOCKED if Rejected */}
                        {app.applicationStatus !== 'rejected' && (
                          <>
                            <button 
                              onClick={() => handleEdit(app)}
                              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-50"
                              title="Edit Registry Entry"
                            >
                              <MdEdit size={18} />
                            </button>
                            
                            {app.applicationStatus === 'pending' && (
                              <button 
                                onClick={() => handleAdmissionAction(app._id, 'approve')}
                                className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-50"
                                title="Authorize Manifest (Verify)"
                              >
                                <MdCheckCircle size={18} />
                              </button>
                            )}

                            {app.applicationStatus === 'approved' && app.admissionStatus !== 'confirmed' && (
                              <button 
                                onClick={() => handleAdmissionAction(app._id, 'confirm')}
                                className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors border border-purple-50"
                                title="Confirm Institutional Seat"
                              >
                                <MdCheckCircle className="rotate-90" size={18} /> 
                              </button>
                            )}

                            {(app.applicationStatus === 'pending' || app.applicationStatus === 'approved') && (
                              <button 
                                onClick={() => handleAdmissionAction(app._id, 'reject')}
                                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors border border-red-50"
                                title="Deny Application"
                              >
                                <MdCancel size={18} />
                              </button>
                            )}
                          </>
                        )}

                        <button 
                          onClick={() => handleDelete(app._id)}
                          className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors border border-rose-50"
                          title="Delete Application"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                        <MdAppRegistration size={50} className="text-slate-300" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching applications in registry</p>
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
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Registry Count</h4>
          <p className="text-3xl font-black text-blue-600 tabular-nums">{applications.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pending Adjudication</h4>
          <p className="text-3xl font-black text-orange-600 tabular-nums">
            {applications.filter(app => app.applicationStatus === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Authorized Admissions</h4>
          <p className="text-3xl font-black text-emerald-600 tabular-nums">
            {applications.filter(app => app.applicationStatus === 'approved').length}
          </p>
        </div>
      </div>

      {/* Modal for viewing application details */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-blue-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50" />
            
            <h3 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-2">
              <MdVisibility className="text-blue-600" /> Identity Manifest
            </h3>

            <div className="space-y-4 relative z-10">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Institutional nomenclature</span>
                <span className="text-sm font-bold text-slate-800">{`${selectedApp.firstName || ''} ${selectedApp.lastName || ''}`.trim() || 'UNNAMED'}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Contact Hotline</span>
                  <span className="text-xs font-bold text-slate-700">{selectedApp.mobile}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Academic Matrix</span>
                  <span className="text-xs font-bold text-slate-700">{selectedApp.class?.className || 'N/A'}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Authentication Email</span>
                <span className="text-xs font-bold text-slate-700">{selectedApp.email}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Current Status</span>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  selectedApp.applicationStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' : 
                  selectedApp.applicationStatus === 'pending' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedApp.applicationStatus}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-8 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Close Manifest
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Applications;
