import React, { useState, useEffect } from 'react';
import { showSuccess, showError, showConfirm, showToast } from '../utils/sweetAlert';
import { FaHome } from 'react-icons/fa';

export default function RoomTypeCharges() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState(null);
  const [formData, setFormData] = useState({
    roomTypeName: '',
    capacity: '',
    monthlyRent: '',
    securityDeposit: '',
    electricityCharges: '',
    effectiveFromDate: '',
    status: 'Active'
  });

  useEffect(() => {
    const savedRoomTypes = localStorage.getItem('roomTypes');
    if (savedRoomTypes) {
      setRoomTypes(JSON.parse(savedRoomTypes));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roomTypeData = {
      ...formData,
      id: editingRoomType?.id || Date.now(),
      createdDate: editingRoomType ? editingRoomType.createdDate : new Date().toLocaleDateString()
    };
    
    let updatedRoomTypes;
    if (editingRoomType) {
      updatedRoomTypes = roomTypes.map(rt => rt.id === editingRoomType.id ? roomTypeData : rt);
      await showSuccess('Updated!', 'Room type updated successfully');
    } else {
      updatedRoomTypes = [...roomTypes, roomTypeData];
      await showSuccess('Created!', 'New room type created successfully');
    }
    
    setRoomTypes(updatedRoomTypes);
    localStorage.setItem('roomTypes', JSON.stringify(updatedRoomTypes));
    setShowForm(false);
    setEditingRoomType(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      roomTypeName: '',
      capacity: '',
      monthlyRent: '',
      securityDeposit: '',
      electricityCharges: '',
      effectiveFromDate: '',
      status: 'Active'
    });
  };

  const handleEdit = (roomType) => {
    setEditingRoomType(roomType);
    setFormData(roomType);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await showConfirm('Delete Room Type?', 'This will permanently delete the room type and all associated data');
    if (result.isConfirmed) {
      const updatedRoomTypes = roomTypes.filter(rt => rt.id !== id);
      setRoomTypes(updatedRoomTypes);
      localStorage.setItem('roomTypes', JSON.stringify(updatedRoomTypes));
      showToast('success', 'Room type deleted successfully');
    }
  };

  return (
    <div className="p-6">
        {/* header */}
             <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 mb-8 border border-white/50">
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
            </div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Room Type & Charges</h2>
          <p className="text-gray-600">Create room types with pricing before creating rooms</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 font-bold transition-all duration-300"
        >
          Create Room Type
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white/50 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">{editingRoomType ? 'Update Room Type' : 'Create New Room Type'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Room Type Name *</label>
              <input
                type="text"
                value={formData.roomTypeName}
                onChange={(e) => setFormData({...formData, roomTypeName: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                placeholder="1 Bed, 2 Bed, 3 Bed"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Capacity *</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                min="1"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Rent *</label>
              <input
                type="number"
                value={formData.monthlyRent}
                onChange={(e) => setFormData({...formData, monthlyRent: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                min="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Security Deposit</label>
              <input
                type="number"
                value={formData.securityDeposit}
                onChange={(e) => setFormData({...formData, securityDeposit: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Electricity Charges (Optional)</label>
              <input
                type="number"
                value={formData.electricityCharges}
                onChange={(e) => setFormData({...formData, electricityCharges: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Effective From Date</label>
              <input
                type="date"
                value={formData.effectiveFromDate}
                onChange={(e) => setFormData({...formData, effectiveFromDate: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            <div className="md:col-span-2 flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 font-bold"
              >
                {editingRoomType ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 font-bold"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Room Types List */}
      <div className="bg-white/50 rounded-2xl overflow-hidden">
        <div className="p-4 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Room Types List ({roomTypes.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Room Type</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Capacity</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Monthly Rent</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Security Deposit</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Electricity</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roomTypes.map((roomType, index) => (
                <tr key={roomType.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="px-4 py-3 font-bold">{roomType.roomTypeName}</td>
                  <td className="px-4 py-3">{roomType.capacity}</td>
                  <td className="px-4 py-3 text-green-600 font-bold">₹{parseInt(roomType.monthlyRent || 0).toLocaleString()}</td>
                  <td className="px-4 py-3">₹{parseInt(roomType.securityDeposit || 0).toLocaleString()}</td>
                  <td className="px-4 py-3">₹{parseInt(roomType.electricityCharges || 0).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      roomType.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {roomType.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(roomType)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 mr-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(roomType.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
                    >
                      Delete
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
}