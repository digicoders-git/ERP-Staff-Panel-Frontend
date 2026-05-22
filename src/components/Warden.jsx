import React, { useState, useEffect } from 'react';
import { MdHome, MdAdd, MdEdit, MdDelete, MdSearch, MdInfo, MdClose, MdPerson, MdSecurity, MdLocalPhone, MdEmail, MdWavingHand } from 'react-icons/md';
import { hostelAPI } from '../utils/apiService';
import { BASE_URL } from '../utils/api';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function Warden() {
  const [wardens, setWardens] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    wardenName: '',
    mobileNumber: '',
    email: '',
    password: '',
    gender: 'male',
    shift: 'day',
    assignedHostel: '',
    status: 'active'
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [wardensRes, hostelsRes] = await Promise.all([
        hostelAPI.getWardens(),
        hostelAPI.getAll()
      ]);
      setWardens(wardensRes.data.wardens || []);
      setHostels(hostelsRes.data.hostels || []);
    } catch (err) {
      toast.error('Warden records synchronization failure');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      wardenName: '',
      mobileNumber: '',
      email: '',
      password: '',
      gender: 'male',
      shift: 'day',
      assignedHostel: hostels[0]?._id || '',
      status: 'active'
    });
    setEditingId(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (warden) => {
    setFormData({
      wardenName: warden.wardenName || '',
      mobileNumber: warden.mobileNumber || '',
      email: warden.email || '',
      password: '', // Leave blank on edit unless they want to change it
      gender: warden.gender || 'male',
      shift: warden.shift || 'day',
      assignedHostel: warden.assignedHostel?._id || '',
      status: warden.status || 'active'
    });
    setEditingId(warden._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.assignedHostel) {
      toast.error('Please assign a hostel to this warden');
      return;
    }

    try {
      setLoading(true);
      const payload = { ...formData };
      
      // If editing and password is empty, remove it from payload so it isn't updated to blank
      if (editingId && !payload.password) {
        delete payload.password;
      }

      if (editingId) {
        await hostelAPI.updateWarden(editingId, payload);
        toast.success('Warden record updated successfully!');
      } else {
        await hostelAPI.createWarden(payload);
        toast.success('New warden created successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchInitialData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Warden registry transaction failure');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Remove Warden Record?',
      text: 'This operation will permanently delete the warden record.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await hostelAPI.deleteWarden(id);
          toast.success('Warden record removed successfully');
          fetchInitialData();
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to remove warden record');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const filteredWardens = wardens.filter(w => 
    w.wardenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.mobileNumber?.includes(searchTerm) ||
    w.assignedHostel?.hostelName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <MdPerson size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">Warden Directory</h1>
              <p className="text-indigo-200 font-medium text-lg">Coordinate dormitory wardens, roster shifts, and campus accommodation oversight</p>
            </div>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="px-8 py-4 bg-white text-indigo-900 hover:bg-indigo-50 font-black rounded-2xl shadow-lg transition duration-200 flex items-center gap-2"
          >
            <MdAdd size={24} />
            <span>Add New Warden</span>
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
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Oversight Officers</h3>
            <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Active Wardens: {wardens.length}</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={24} />
            <input
              type="text"
              placeholder="Search Wardens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                <th className="px-10 py-6">Warden Officer</th>
                <th className="px-10 py-6">Mobile Number</th>
                <th className="px-10 py-6 text-center">Gender</th>
                <th className="px-10 py-6 text-center">Assigned Facility</th>
                <th className="px-10 py-6 text-center">Shift Schedule</th>
                <th className="px-10 py-6 text-center">Status</th>
                <th className="px-10 py-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWardens.length > 0 ? filteredWardens.map((warden) => (
                <tr key={warden._id} className="hover:bg-indigo-50/30 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                        {warden.profileImage ? (
                          <img 
                            src={warden.profileImage.startsWith('http') ? warden.profileImage : `${BASE_URL}/${warden.profileImage.replace(/\\/g, '/')}`} 
                            alt={warden.wardenName} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <MdPerson size={24} />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{warden.wardenName}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{warden.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-sm font-bold text-slate-600">
                    {warden.mobileNumber}
                  </td>
                  <td className="px-10 py-8 text-center text-sm font-bold text-slate-600 capitalize">
                    {warden.gender}
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-black text-slate-700 border border-slate-200">
                      {warden.assignedHostel?.hostelName || 'Unassigned'}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center text-sm font-black text-slate-700 uppercase tracking-wider">
                    {warden.shift}
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border shadow-sm ${
                        warden.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${warden.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        {warden.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(warden)}
                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                        title="Edit Warden"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(warden._id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete Warden"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-10 py-32 text-center text-slate-300">
                    <div className="flex flex-col items-center gap-6">
                      <MdPerson size={80} className="text-slate-100" />
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.3em] mb-2">Wardens Empty</p>
                        <p className="text-[10px] font-bold text-slate-400">MANIFEST A NEW WARDEN RECORD TO INITIATE HOUSING OVERSIZE OFFICERS</p>
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
                <h3 className="text-xl font-bold">{editingId ? 'Edit Warden Record' : 'Add New Warden'}</h3>
                <p className="text-xs text-indigo-200 mt-1">Provide warden profile and shifting parameters</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white transition-colors">
                <MdClose size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Warden Name</label>
                  <input
                    type="text"
                    name="wardenName"
                    value={formData.wardenName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                    placeholder="e.g., Rajesh Kumar"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                      placeholder="e.g. 9876543210"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                      placeholder="e.g. rajesh@school.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!editingId}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                      placeholder={editingId ? '••••••••' : 'Password'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Shift</label>
                    <select
                      name="shift"
                      value={formData.shift}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                    >
                      <option value="day">Day Shift</option>
                      <option value="night">Night Shift</option>
                      <option value="all">All Day</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Assigned Hostel Facility</label>
                  <select
                    name="assignedHostel"
                    value={formData.assignedHostel}
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
                  {editingId ? 'Update Warden' : 'Save Warden'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}