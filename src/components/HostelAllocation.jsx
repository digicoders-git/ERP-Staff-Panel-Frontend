import React, { useState, useEffect } from 'react';
import { MdHome, MdAdd, MdEdit, MdDelete, MdSearch, MdInfo, MdClose, MdHotel, MdCalendarToday, MdAttachMoney, MdCancel } from 'react-icons/md';
import { hostelAPI, studentAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function HostelAllocation() {
  const [allocations, setAllocations] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Student search states
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [searchedStudents, setSearchedStudents] = useState([]);
  const [isSearchingStudents, setIsSearchingStudents] = useState(false);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    hostel: '',
    roomNo: '',
    joiningDate: '',
    monthlyRent: '',
    securityDeposit: '',
    remark: ''
  });

  // Debounced active student search
  useEffect(() => {
    if (!studentSearchTerm.trim()) {
      setSearchedStudents([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        setIsSearchingStudents(true);
        const res = await studentAPI.searchActive({ search: studentSearchTerm });
        if (res.data && res.data.success) {
          setSearchedStudents(res.data.students || []);
        }
      } catch (err) {
        console.error('Error searching students:', err);
      } finally {
        setIsSearchingStudents(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [studentSearchTerm]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [allocationsRes, hostelsRes, roomsRes] = await Promise.all([
        hostelAPI.getAllocations(),
        hostelAPI.getAll(),
        hostelAPI.getRooms()
      ]);
      setAllocations(allocationsRes.data.allocations || []);
      setHostels(hostelsRes.data.hostels || []);
      setRooms(roomsRes.data.rooms || []);
    } catch (err) {
      toast.error('Allocation records synchronization failure');
    } finally {
      setLoading(false);
    }
  };

  // Filter rooms based on selected hostel
  const availableRooms = rooms.filter(room => 
    formData.hostel ? String(room.hostel?._id) === String(formData.hostel) && room.status === 'available' : false
  );

  // Auto populate rent when room is selected
  useEffect(() => {
    if (formData.roomNo && formData.hostel) {
      const selectedRoom = rooms.find(r => r.roomNo === formData.roomNo && String(r.hostel?._id) === String(formData.hostel));
      if (selectedRoom) {
        setFormData(prev => ({
          ...prev,
          monthlyRent: selectedRoom.monthlyRent || 0,
          // Let's assume a default security deposit equal to 1 month's rent if not already set
          securityDeposit: prev.securityDeposit || selectedRoom.monthlyRent || 0
        }));
      }
    }
  }, [formData.roomNo, formData.hostel, rooms]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      studentName: '',
      hostel: hostels[0]?._id || '',
      roomNo: '',
      joiningDate: new Date().toISOString().split('T')[0],
      monthlyRent: '',
      securityDeposit: '',
      remark: ''
    });
    setEditingId(null);
    setStudentSearchTerm('');
    setSelectedStudent(null);
    setShowStudentDropdown(false);
    setSearchedStudents([]);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (alloc) => {
    setFormData({
      studentId: alloc.studentId || '',
      studentName: alloc.studentName || '',
      hostel: alloc.hostel?._id || '',
      roomNo: alloc.roomNo || '',
      joiningDate: alloc.joiningDate ? alloc.joiningDate.split('T')[0] : '',
      monthlyRent: alloc.monthlyRent || '',
      securityDeposit: alloc.securityDeposit || '',
      remark: alloc.remark || ''
    });
    setEditingId(alloc._id);
    setSelectedStudent({
      admissionNumber: alloc.studentId,
      firstName: alloc.studentName ? alloc.studentName.split(' ')[0] : '',
      lastName: alloc.studentName ? alloc.studentName.split(' ').slice(1).join(' ') : ''
    });
    setStudentSearchTerm(alloc.studentName || '');
    setShowStudentDropdown(false);
    setSearchedStudents([]);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId) {
      toast.error('Please select an enrolled student from the database');
      return;
    }
    if (!formData.hostel) {
      toast.error('Please select a hostel');
      return;
    }
    if (!formData.roomNo) {
      toast.error('Please select/enter a room number');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        monthlyRent: Number(formData.monthlyRent),
        securityDeposit: Number(formData.securityDeposit)
      };

      if (editingId) {
        await hostelAPI.updateAllocation(editingId, payload);
        toast.success('Allocation record updated successfully!');
      } else {
        await hostelAPI.allocate(payload);
        toast.success('Dormitory bed allocated successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchInitialData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Dormitory allocation registry failure');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Cancel Allocation?',
      text: 'This operation will set the status of this allocation to cancelled.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, cancel it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await hostelAPI.deleteAllocation(id);
          toast.success('Allocation cancelled successfully');
          fetchInitialData();
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to cancel allocation');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const filteredAllocations = allocations.filter(alloc => {
    const matchesSearch = 
      alloc.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alloc.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alloc.roomNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alloc.hostel?.hostelName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'All' || 
      (statusFilter === 'allocated' && alloc.allocationStatus === 'allocated') ||
      (statusFilter === 'cancelled' && alloc.allocationStatus === 'cancelled');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <MdHotel size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">Hostel Allocations</h1>
              <p className="text-indigo-200 font-medium text-lg">Manage student room assignments, security deposits, and dormitory occupancy</p>
            </div>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="px-8 py-4 bg-white text-indigo-900 hover:bg-indigo-50 font-black rounded-2xl shadow-lg transition duration-200 flex items-center gap-2"
          >
            <MdAdd size={24} />
            <span>New Allocation</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-[100]">
          <FaSpinner className="animate-spin text-indigo-600 text-5xl" />
        </div>
      )}

      {/* Records Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-50/30">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Dormitory Residents</h3>
            <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Active Allocations: {allocations.length}</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80 group">
              <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={24} />
              <input
                type="text"
                placeholder="Search allocations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition-all outline-none"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition-all outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="allocated">Active Allocations</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                <th className="px-10 py-6">Student Resident</th>
                <th className="px-10 py-6">Hostel / Dorm</th>
                <th className="px-10 py-6 text-center">Room No</th>
                <th className="px-10 py-6 text-center">Rent & Security</th>
                <th className="px-10 py-6 text-center">Allocation Date</th>
                <th className="px-10 py-6 text-center">Status</th>
                <th className="px-10 py-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAllocations.length > 0 ? filteredAllocations.map((alloc) => (
                <tr key={alloc._id} className="hover:bg-indigo-50/30 transition-all group">
                  <td className="px-10 py-8">
                    <div>
                      <div className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{alloc.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: {alloc.studentId}</div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div>
                      <div className="text-sm font-black text-slate-800">{alloc.hostel?.hostelName || 'Unmapped Hostel'}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Campus Residence</div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center text-sm font-black text-slate-700">
                    Room {alloc.roomNo}
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div>
                      <span className="text-sm font-black text-emerald-600">₹{alloc.monthlyRent?.toLocaleString()} / mo</span>
                      <div className="text-[10px] text-slate-400 font-bold mt-1">Deposit: ₹{alloc.securityDeposit?.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center text-sm font-bold text-slate-600">
                    {alloc.joiningDate ? new Date(alloc.joiningDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${
                        alloc.allocationStatus === 'allocated' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${alloc.allocationStatus === 'allocated' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        {alloc.allocationStatus === 'allocated' ? 'Active' : 'Cancelled'}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="flex justify-center gap-2">
                      {alloc.allocationStatus === 'allocated' && (
                        <>
                          <button
                            onClick={() => handleOpenEditModal(alloc)}
                            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                            title="Edit Allocation"
                          >
                            <MdEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(alloc._id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Cancel Allocation"
                          >
                            <MdCancel size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-10 py-32 text-center text-slate-300">
                    <div className="flex flex-col items-center gap-6">
                      <MdHotel size={80} className="text-slate-100" />
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.3em] mb-2">Allocations Empty</p>
                        <p className="text-[10px] font-bold text-slate-400">ASSIGN A DORMITORY ROOM BED TO AN ACTIVE STUDENT RESIDENT</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{editingId ? 'Edit Allocation' : 'New Room Allocation'}</h3>
                <p className="text-xs text-indigo-200 mt-1">Provide resident and hostel assignment details</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white transition-colors">
                <MdClose size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                {/* Searchable Student Lookup Dropdown */}
                <div className="relative">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    Student Resident Lookup
                  </label>
                  
                  {selectedStudent ? (
                    <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-800">
                            {selectedStudent.firstName} {selectedStudent.lastName}
                          </div>
                          <div className="text-xs font-bold text-slate-400">
                            ID: {selectedStudent.admissionNumber}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStudent(null);
                          setStudentSearchTerm('');
                          setFormData(prev => ({ ...prev, studentId: '', studentName: '' }));
                        }}
                        className="p-1.5 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors"
                      >
                        <MdClose size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="text"
                          value={studentSearchTerm}
                          onChange={(e) => {
                            setStudentSearchTerm(e.target.value);
                            setShowStudentDropdown(true);
                          }}
                          onFocus={() => setShowStudentDropdown(true)}
                          onBlur={() => setTimeout(() => setShowStudentDropdown(false), 200)}
                          placeholder="Search active students by name or ID..."
                          className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                        />
                        {isSearchingStudents && (
                          <FaSpinner className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-indigo-600" />
                        )}
                      </div>

                      {/* Dropdown menu */}
                      {showStudentDropdown && studentSearchTerm.trim() && (
                        <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-50">
                          {searchedStudents.length > 0 ? (
                            searchedStudents.map((student) => (
                              <div
                                key={student.admissionNumber}
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setFormData(prev => ({
                                    ...prev,
                                    studentId: student.admissionNumber,
                                    studentName: `${student.firstName} ${student.lastName}`
                                  }));
                                  setShowStudentDropdown(false);
                                  setStudentSearchTerm(`${student.firstName} ${student.lastName}`);
                                }}
                                className="flex items-center justify-between px-4 py-3 hover:bg-indigo-50/50 cursor-pointer transition-colors"
                              >
                                <div>
                                  <div className="text-sm font-black text-slate-800">
                                    {student.firstName} {student.lastName}
                                  </div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                    ID: {student.admissionNumber}
                                  </div>
                                </div>
                                <div className="text-[10px] px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-full uppercase tracking-wider">
                                  Enrolled
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-6 text-center text-slate-400 text-xs font-bold">
                              No active students found matching "{studentSearchTerm}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Select Hostel</label>
                    <select
                      name="hostel"
                      value={formData.hostel}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                    >
                      <option value="">Select Hostel</option>
                      {hostels.map(h => (
                        <option key={h._id} value={h._id}>{h.hostelName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Room Number</label>
                    {availableRooms.length > 0 ? (
                      <select
                        name="roomNo"
                        value={formData.roomNo}
                        onChange={handleInputChange}
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                      >
                        <option value="">Select Room</option>
                        {availableRooms.map(r => (
                          <option key={r._id} value={r.roomNo}>{r.roomNo} (Floor {r.floorNo})</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="roomNo"
                        value={formData.roomNo}
                        onChange={handleInputChange}
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                        placeholder="e.g., 205"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Joining Date</label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Monthly Rent (₹)</label>
                    <input
                      type="number"
                      name="monthlyRent"
                      value={formData.monthlyRent}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                      placeholder="Monthly Rent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Security Deposit (₹)</label>
                    <input
                      type="number"
                      name="securityDeposit"
                      value={formData.securityDeposit}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                      placeholder="Security Deposit"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Remarks</label>
                  <textarea
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                    placeholder="Enter allocation notes..."
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-xl transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-slate-900 to-indigo-900 text-white hover:opacity-95 font-bold rounded-xl transition text-sm shadow-md"
                >
                  {editingId ? 'Update Allocation' : 'Save Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}