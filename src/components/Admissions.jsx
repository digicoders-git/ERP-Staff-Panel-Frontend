import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPersonAdd, MdCheckCircle, MdPending, MdSearch, MdFilterList, MdVisibility, MdEdit, MdDelete, MdAdd, MdClose, MdSave } from 'react-icons/md';
import { FaSpinner, FaUsers } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { admissionAPI, classAPI, studentAPI } from '../utils/apiService';
import ParentCredentialsManagement from './ParentCredentialsManagement';

const Admissions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [showParentModal, setShowParentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const itemsPerPage = 10;

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const res = await admissionAPI.getAll({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : '',
        classId: classFilter !== 'all' ? classFilter : ''
      });
      
      let studentsList = [];
      if (res.data.students) {
        studentsList = res.data.students;
      } else if (res.data.data?.students) {
        studentsList = res.data.data.students;
      } else if (Array.isArray(res.data)) {
        studentsList = res.data;
      }
      
      if (studentsList && studentsList.length > 0) {
        setTotalRecords(res.data.pagination?.total || studentsList.length);
        setAdmissions(studentsList.map(s => ({
          id: s._id || s.id,
          admissionNumber: s.admissionNumber || s._id || s.id,
          name: `${s.firstName || s.name || ''} ${s.lastName || ''}`.trim() || 'UNNAMED',
          class: s.class?.className || s.className || '-',
          stream: s.stream || '-',
          section: s.section?.sectionName || s.sectionName || '-',
          status: s.admissionStatus === 'confirmed' ? 'confirmed' : 
                 (s.verificationStatus === 'partial' ? 'partial' :
                 (s.admissionStatus === 'rejected' || s.applicationStatus === 'rejected' ? 'rejected' : 
                 (s.applicationStatus === 'approved' ? 'verified' : 'pending'))),
          verificationRemarks: s.verificationRemarks || '',
          date: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          mobile: s.phone || s.mobile || '-',
          email: s.email || '-',
          fatherName: s.guardianInfo?.fatherName || s.fatherName || '-',
          address: s.currentAddress?.address || s.address || '-',
          dob: s.dob ? new Date(s.dob).toLocaleDateString() : '-',
          medicalCertificate: 'uploaded'
        })));
      } else {
        setAdmissions([]);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error('Failed to fetch admissions:', err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to fetch admissions', 'error');
      setAdmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await classAPI.getAll();
      let classList = [];
      
      if (res.data.classes) {
        classList = res.data.classes;
      } else if (res.data.data?.classes) {
        classList = res.data.data.classes;
      } else if (Array.isArray(res.data)) {
        classList = res.data;
      }
      
      if (classList && classList.length > 0) {
        setClasses(classList);
      }
    } catch (err) {
      console.error('Failed to fetch classes:', err);
      setClasses([]);
    }
  };

  useEffect(() => {
    fetchAdmissions();
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchAdmissions();
  }, [searchTerm, statusFilter, classFilter, currentPage]);

  const handleView = (admission) => {
    navigate(`/student-profile/${admission.id}`);
  };

  const handleEdit = (admission) => {
    navigate(`/edit-admission/${admission.id}`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if (result.isConfirmed) {
      try {
        await admissionAPI.delete(id);
        Swal.fire('Deleted!', 'Admission record has been deleted.', 'success');
        fetchAdmissions();
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Failed to delete', 'error');
      }
    }
  };

  const handleAdmissionAction = async (appId, action) => {
    try {
      if (action === 'approve') {
        await studentAPI.verify(appId, { status: 'verified', remarks: 'Institutional Authorization Granted' });
        Swal.fire('Success', 'Manifest Verified: Identity Authorized! ✅', 'success');
      } else if (action === 'confirm') {
        await admissionAPI.update(appId, { admissionStatus: 'confirmed' });
        Swal.fire('Success', 'Seat Confirmed: Admission Finalized! 🛡️', 'success');
      } else if (action === 'reject') {
        await studentAPI.verify(appId, { status: 'rejected', remarks: 'Admission Petition Denied' });
        Swal.fire('Declined', 'Petition Synchronized: Application Rejected ❌', 'error');
      }
      fetchAdmissions();
    } catch (err) {
      console.error('Status sync failure:', err);
      Swal.fire('Error', 'Registry Sync Protocol Interrupted', 'error');
    }
  };

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border border-green-200';
      case 'verified': return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'partial': return 'bg-orange-100 text-orange-700 border border-orange-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-700 border border-red-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <FaSpinner className="animate-spin text-blue-500 text-5xl" />
        </div>
      )}
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <MdPersonAdd size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-2 tracking-tight">Admission Management</h2>
          <p className="text-blue-200 text-lg font-medium">Complete admission records with advanced filtering and student insights</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <MdPersonAdd size={24} />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">TOTAL</span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Applications</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{admissions.length}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <MdCheckCircle size={24} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">SUCCESS</span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Confirmed</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{admissions.filter(item => item.status === 'confirmed').length}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600">
              <MdPending size={24} />
            </div>
            <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg">WAITING</span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{admissions.filter(item => item.status === 'pending').length}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 rounded-xl text-red-600">
              <MdDelete size={24} />
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">DECLINED</span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Rejected</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{admissions.filter(item => item.status === 'rejected').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, ID, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium text-gray-600"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium text-gray-600"
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>{cls.className}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Admission Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Admission Records ({totalRecords})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">ID</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Name</th>
                <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Class</th>
                <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Stream</th>
                <th className="hidden lg:table-cell px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Section</th>
                <th className="hidden lg:table-cell px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Mobile</th>
                <th className="hidden xl:table-cell px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Email</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admissions.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.admissionNumber}</td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="sm:hidden text-xs text-gray-500">{item.class} | {item.section}</div>
                  </td>
                  <td className="hidden sm:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-700">{item.class}</td>
                  <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-700 font-bold text-blue-600">{item.stream || '-'}</td>
                  <td className="hidden lg:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-700">{item.section || '-'}</td>
                  <td className="hidden lg:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-700">{item.mobile}</td>
                  <td className="hidden xl:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-700">{item.email}</td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={`inline-flex px-2 py-1 text-[10px] font-black uppercase rounded-lg w-fit ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      {item.status === 'partial' && item.verificationRemarks && (
                        <span className="text-[8px] text-orange-500 font-bold mt-1 max-w-[120px] truncate" title={item.verificationRemarks}>
                          {item.verificationRemarks.replace('Pending Documents: ', '')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleView(item)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="View"
                      >
                        <MdVisibility size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                        title="Edit"
                      >
                        <MdEdit size={16} />
                      </button>

                      {item.status === 'pending' && (
                        <button 
                          onClick={() => handleAdmissionAction(item.id, 'approve')}
                          className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"
                          title="Verify Manifest"
                        >
                          <MdCheckCircle size={16} />
                        </button>
                      )}

                      {item.status === 'verified' && (
                        <button 
                          onClick={() => handleAdmissionAction(item.id, 'confirm')}
                          className="p-1 text-purple-600 hover:bg-purple-100 rounded"
                          title="Confirm Seat"
                        >
                          <MdCheckCircle className="rotate-90" size={16} />
                        </button>
                      )}

                      {(item.status === 'pending' || item.status === 'verified') && (
                        <button 
                          onClick={() => handleAdmissionAction(item.id, 'reject')}
                          className="p-1 text-red-500 hover:bg-red-100 rounded"
                          title="Reject"
                        >
                          <MdClose size={16} />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedStudent({ id: item.id, name: item.name });
                          setShowParentModal(true);
                        }}
                        className="p-1 text-purple-600 hover:bg-purple-100 rounded"
                        title="Manage Parent Credentials"
                      >
                        <FaUsers size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Delete"
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 border rounded-lg ${currentPage === index + 1
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                  : 'border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Parent Credentials Modal */}
      {showParentModal && selectedStudent && (
        <ParentCredentialsManagement
          studentId={selectedStudent.id}
          studentName={selectedStudent.name}
          onClose={() => {
            setShowParentModal(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
};

export default Admissions;
