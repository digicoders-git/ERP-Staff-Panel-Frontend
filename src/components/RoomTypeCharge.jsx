import React, { useState, useEffect } from 'react';
import { FaHome, FaSpinner, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { hostelAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function RoomTypeCharges() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    roomTypeName: '',
    capacity: '',
    monthlyRent: '',
    securityDeposit: '',
    electricityCharges: '',
    effectiveFrom: '',
    status: true
  });

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const res = await hostelAPI.getRoomTypes();
      setRoomTypes(res.data.roomTypes || []);
    } catch (err) {
      toast.error('Residential classification records synchronization failure');
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
      roomTypeName: '',
      capacity: '',
      monthlyRent: '',
      securityDeposit: '',
      electricityCharges: '',
      effectiveFrom: '',
      status: true
    });
    setEditingId(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (roomType) => {
    setFormData({
      roomTypeName: roomType.roomTypeName || '',
      capacity: roomType.capacity || '',
      monthlyRent: roomType.monthlyRent || '',
      securityDeposit: roomType.securityDeposit || '',
      electricityCharges: roomType.electricityCharges || '',
      effectiveFrom: roomType.effectiveFrom ? roomType.effectiveFrom.split('T')[0] : '',
      status: roomType.status !== undefined ? roomType.status : true
    });
    setEditingId(roomType._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        capacity: parseInt(formData.capacity),
        monthlyRent: parseFloat(formData.monthlyRent),
        securityDeposit: parseFloat(formData.securityDeposit),
        electricityCharges: parseFloat(formData.electricityCharges || 0)
      };

      if (editingId) {
        await hostelAPI.updateRoomType(editingId, payload);
        toast.success('Room type updated successfully!');
      } else {
        await hostelAPI.createRoomType(payload);
        toast.success('New room type registered successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchRoomTypes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Room type registry transaction failure');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Remove Room Type?',
      text: 'This operation will permanently delete this room classification.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await hostelAPI.deleteRoomType(id);
          toast.success('Room type removed successfully');
          fetchRoomTypes();
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to remove room type');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="p-6">
      {/* Header Banner */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 mb-8 border border-white/50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaHome className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Hostel Management
              </h1>
              <p className="text-gray-600 mt-1">Manage hostel facilities and accommodations</p>
            </div>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-xl shadow-md hover:from-green-700 hover:to-teal-700 transition duration-200 flex items-center gap-2"
          >
            <FaPlus />
            <span>Create Room Type</span>
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Room Type & Charges</h2>
          <p className="text-gray-600">Configure room categories and pricing structures</p>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <FaSpinner className="animate-spin text-green-600 text-4xl" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Accessing Classification Records...</p>
        </div>
      )}

      {/* Room Types List */}
      {!loading && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="p-5 bg-gray-50/50 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Room Types List ({roomTypes.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-gray-800">Room Type</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-800">Capacity</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-800">Monthly Rent</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-800">Security Deposit</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-800">Electricity Charges</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-800">Effective From</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-800">Status</th>
                  <th className="px-6 py-4 text-center font-bold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roomTypes.map((roomType, index) => (
                  <tr key={roomType._id} className={`border-b hover:bg-gray-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'}`}>
                    <td className="px-6 py-4 font-bold text-gray-800">{roomType.roomTypeName}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{roomType.capacity} Beds</td>
                    <td className="px-6 py-4 text-green-600 font-bold">₹{parseInt(roomType.monthlyRent || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600 font-semibold">₹{parseInt(roomType.securityDeposit || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600 font-semibold">₹{parseInt(roomType.electricityCharges || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {roomType.effectiveFrom ? roomType.effectiveFrom.split('T')[0] : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        roomType.status ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                        {roomType.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(roomType)}
                          className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                          title="Edit Room Type"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(roomType._id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          title="Delete Room Type"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {roomTypes.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-gray-400">
                      No room types registered yet. Click Create Room Type to begin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{editingId ? 'Edit Room Type' : 'Create Room Type'}</h3>
                <p className="text-xs text-green-100 mt-1">Configure pricing & occupancy options</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white transition-colors">
                <MdClose size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Room Type Name</label>
                  <input
                    type="text"
                    name="roomTypeName"
                    value={formData.roomTypeName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 font-semibold text-slate-800 transition outline-none text-sm"
                    placeholder="e.g., Deluxe Single, Standard Double"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Capacity (Beds)</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 font-semibold text-slate-800 transition outline-none text-sm"
                      placeholder="e.g., 2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Monthly Rent (₹)</label>
                    <input
                      type="number"
                      name="monthlyRent"
                      value={formData.monthlyRent}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 font-semibold text-slate-800 transition outline-none text-sm"
                      placeholder="e.g., 5000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Security Deposit (₹)</label>
                    <input
                      type="number"
                      name="securityDeposit"
                      value={formData.securityDeposit}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 font-semibold text-slate-800 transition outline-none text-sm"
                      placeholder="e.g., 10000"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Electricity Charges (₹)</label>
                    <input
                      type="number"
                      name="electricityCharges"
                      value={formData.electricityCharges}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 font-semibold text-slate-800 transition outline-none text-sm"
                      placeholder="e.g., 500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Effective From</label>
                  <input
                    type="date"
                    name="effectiveFrom"
                    value={formData.effectiveFrom}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 font-semibold text-slate-800 transition outline-none text-sm"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="status"
                    name="status"
                    checked={formData.status}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-green-600 border-slate-300 rounded focus:ring-green-500 cursor-pointer"
                  />
                  <label htmlFor="status" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
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
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-600 to-teal-600 text-white hover:opacity-95 font-bold rounded-xl transition text-sm shadow-md"
                >
                  {editingId ? 'Update Type' : 'Save Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}