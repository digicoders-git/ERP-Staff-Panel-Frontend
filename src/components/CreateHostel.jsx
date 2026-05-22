import React, { useState, useEffect } from 'react';
import { MdHome, MdAdd, MdEdit, MdDelete, MdPhone, MdLocationOn, MdHistory, MdFilterList, MdSearch, MdClose } from 'react-icons/md';
import { hostelAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function CreateHostel() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    hostelName: '',
    hostelCode: '',
    type: 'boys',
    contactNo: '',
    totalFloor: '',
    status: true
  });

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const res = await hostelAPI.getAll();
      setHostels(res.data.hostels || []);
    } catch (err) {
      toast.error('School hostel records synchronization failure');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      hostelName: '',
      hostelCode: '',
      type: 'boys',
      contactNo: '',
      totalFloor: '',
      status: true
    });
    setEditingId(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (hostel) => {
    setFormData({
      hostelName: hostel.hostelName || '',
      hostelCode: hostel.hostelCode || '',
      type: hostel.type || 'boys',
      contactNo: hostel.contactNo || '',
      totalFloor: hostel.totalFloor || '',
      status: hostel.status !== undefined ? hostel.status : true
    });
    setEditingId(hostel._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        totalFloor: parseInt(formData.totalFloor)
      };

      if (editingId) {
        await hostelAPI.update(editingId, payload);
        toast.success('Hostel records updated successfully!');
      } else {
        await hostelAPI.create(payload);
        toast.success('New hostel registered successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchHostels();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Hostel registry transaction failure');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Remove Hostel Record?',
      text: 'This operation will permanently delete the hostel record.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await hostelAPI.delete(id);
          toast.success('Hostel record removed successfully');
          fetchHostels();
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to remove hostel record');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const filteredHostels = hostels.filter(h => 
    h.hostelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.hostelCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <MdHome size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">Dormitory Records</h1>
              <p className="text-indigo-200 font-medium text-lg">Record school residential facilities and infrastructure records</p>
            </div>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="px-8 py-4 bg-white text-indigo-900 hover:bg-indigo-50 font-black rounded-2xl shadow-lg transition duration-200 flex items-center gap-2"
          >
            <MdAdd size={24} />
            <span>Add New Hostel</span>
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
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">School Records</h3>
            <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Active Dormitory Inventory: {hostels.length}</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={24} />
            <input
              type="text"
              placeholder="Search Hostels..."
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
                <th className="px-10 py-6">Identity Record</th>
                <th className="px-10 py-6 text-center">Protocol Code</th>
                <th className="px-10 py-6 text-center">Classification</th>
                <th className="px-10 py-6 text-center">Structural Floors</th>
                <th className="px-10 py-6 text-center">Operational Contact</th>
                <th className="px-10 py-6 text-center">Records Status</th>
                <th className="px-10 py-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHostels.length > 0 ? filteredHostels.map((hostel) => (
                <tr key={hostel._id} className="hover:bg-indigo-50/30 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                        <MdHome size={22} />
                      </div>
                      <div className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{hostel.hostelName}</div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest border border-slate-200">
                      {hostel.hostelCode}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 justify-center w-fit mx-auto ${
                      hostel.type?.toLowerCase() === 'boys' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                      hostel.type?.toLowerCase() === 'girls' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                      'bg-indigo-50 text-indigo-700 border-indigo-100'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${hostel.type?.toLowerCase() === 'boys' ? 'bg-blue-500' : hostel.type?.toLowerCase() === 'girls' ? 'bg-rose-500' : 'bg-indigo-500'}`} />
                      {hostel.type}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center text-sm font-black text-slate-700 tabular-nums">
                    {hostel.totalFloor} Floors
                  </td>
                  <td className="px-10 py-8 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {hostel.contactNo}
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm border ${
                        hostel.status ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${hostel.status ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        {hostel.status ? 'Active Record' : 'Revoked Protocol'}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(hostel)}
                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                        title="Edit Hostel"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(hostel._id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete Hostel"
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
                      <MdHome size={80} className="text-slate-100" />
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.3em] mb-2">School Records Empty</p>
                        <p className="text-[10px] font-bold text-slate-400">MANIFEST NEW DORMITORY RECORD TO CO-ORDINATE RESIDENTIAL MATRIX</p>
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
                <h3 className="text-xl font-bold">{editingId ? 'Edit Hostel Record' : 'Add New Hostel'}</h3>
                <p className="text-xs text-indigo-200 mt-1">Provide dormitory configuration parameters</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white transition-colors">
                <MdClose size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Hostel Name</label>
                  <input
                    type="text"
                    name="hostelName"
                    value={formData.hostelName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                    placeholder="e.g., Boys Residency"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Hostel Code</label>
                  <input
                    type="text"
                    name="hostelCode"
                    value={formData.hostelCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                    placeholder="e.g., HOST-B"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                    >
                      <option value="boys">Boys</option>
                      <option value="girls">Girls</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Floors</label>
                    <input
                      type="number"
                      name="totalFloor"
                      value={formData.totalFloor}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                      placeholder="e.g., 3"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Contact Number</label>
                  <input
                    type="tel"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                    placeholder="e.g., +91 9876543210"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="status"
                    name="status"
                    checked={formData.status}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="status" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                    Active & Available
                  </label>
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
                  {editingId ? 'Update Record' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}