import React, { useState, useEffect } from 'react';
import { showSuccess, showError, showConfirm, showToast } from '../utils/sweetAlert';
import { FaHome } from 'react-icons/fa';

export default function Room() {
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    hostelName: '',
    floorNo: '',
    roomNumber: '',
    roomType: '',
    maxCapacity: '',
    monthlyRent: '',
    status: 'Available'
  });

  useEffect(() => {
    const loadData = () => {
      const savedRooms = localStorage.getItem('rooms');
      const savedHostels = localStorage.getItem('hostels');
      const savedRoomTypes = localStorage.getItem('roomTypes');
      if (savedRooms) setRooms(JSON.parse(savedRooms));
      if (savedHostels) setHostels(JSON.parse(savedHostels));
      if (savedRoomTypes) setRoomTypes(JSON.parse(savedRoomTypes));
    };
    
    loadData();
    
    // Listen for storage changes to refresh data when room types are created
    const handleStorageChange = (e) => {
      if (e.key === 'roomTypes') {
        loadData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for updates every 2 seconds (for same-tab updates)
    const interval = setInterval(loadData, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (formData.roomType) {
      const selectedRoomType = roomTypes.find(rt => rt.roomTypeName === formData.roomType);
      if (selectedRoomType) {
        setFormData(prev => ({
          ...prev,
          maxCapacity: selectedRoomType.capacity,
          monthlyRent: selectedRoomType.monthlyRent
        }));
      }
    }
  }, [formData.roomType, roomTypes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roomData = {
      ...formData,
      id: editingRoom?.id || Date.now(),
      createdDate: editingRoom ? editingRoom.createdDate : new Date().toLocaleDateString()
    };
    
    let updatedRooms;
    if (editingRoom) {
      updatedRooms = rooms.map(r => r.id === editingRoom.id ? roomData : r);
      await showSuccess('Updated!', 'Room information updated successfully');
    } else {
      updatedRooms = [...rooms, roomData];
      await showSuccess('Created!', 'New room created successfully');
    }
    
    setRooms(updatedRooms);
    localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    setShowForm(false);
    setEditingRoom(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      hostelName: '',
      floorNo: '',
      roomNumber: '',
      roomType: '',
      maxCapacity: '',
      monthlyRent: '',
      status: 'Available'
    });
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData(room);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await showConfirm('Delete Room?', 'This will permanently delete the room and all associated data');
    if (result.isConfirmed) {
      const updatedRooms = rooms.filter(r => r.id !== id);
      setRooms(updatedRooms);
      localStorage.setItem('rooms', JSON.stringify(updatedRooms));
      showToast('success', 'Room deleted successfully');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Room Create / List</h2>
          <p className="text-gray-600">Manage hostel rooms using created room types ({roomTypes.length} room types available)</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              const savedRoomTypes = localStorage.getItem('roomTypes');
              if (savedRoomTypes) setRoomTypes(JSON.parse(savedRoomTypes));
            }}
            className="bg-blue-500 text-white px-4 py-3 rounded-xl hover:bg-blue-600 font-bold transition-all duration-300"
          >
            Refresh Room Types
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 font-bold transition-all duration-300"
          >
            Create Room
          </button>
        </div>
      </div>

      {/* Alert if no room types */}
      {roomTypes.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please create room types first in <strong>Room Type & Charges</strong> section before creating rooms.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>{roomTypes.length} Room Types Available:</strong> {roomTypes.map(rt => rt.roomTypeName).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white/50 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">{editingRoom ? 'Update Room' : 'Create New Room'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Hostel Name *</label>
              <select
                value={formData.hostelName}
                onChange={(e) => setFormData({...formData, hostelName: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Hostel</option>
                {hostels.map(hostel => (
                  <option key={hostel.id} value={hostel.hostelName}>{hostel.hostelName}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Floor No</label>
              <input
                type="number"
                value={formData.floorNo}
                onChange={(e) => setFormData({...formData, floorNo: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Room Number *</label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Room Type *</label>
              <select
                value={formData.roomType}
                onChange={(e) => setFormData({...formData, roomType: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Room Type</option>
                {roomTypes.filter(rt => rt.status === 'Active').map(roomType => (
                  <option key={roomType.id} value={roomType.roomTypeName}>
                    {roomType.roomTypeName} (₹{roomType.monthlyRent})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Max Capacity (Auto)</label>
              <input
                type="number"
                value={formData.maxCapacity}
                className="w-full border-2 border-gray-200 p-3 rounded-xl bg-gray-100"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Rent (Auto)</label>
              <input
                type="number"
                value={formData.monthlyRent}
                className="w-full border-2 border-gray-200 p-3 rounded-xl bg-gray-100"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            
            <div className="md:col-span-3 flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 font-bold"
                disabled={roomTypes.length === 0}
              >
                {editingRoom ? 'Update' : 'Save'}
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

      {/* Room List */}
      <div className="bg-white/50 rounded-2xl overflow-hidden">
        <div className="p-4 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Room List ({rooms.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Hostel</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Floor</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Room No</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Room Type</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Capacity</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Monthly Rent</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr key={room.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="px-4 py-3 font-bold">{room.hostelName}</td>
                  <td className="px-4 py-3">{room.floorNo}</td>
                  <td className="px-4 py-3 font-bold">{room.roomNumber}</td>
                  <td className="px-4 py-3">{room.roomType}</td>
                  <td className="px-4 py-3">{room.maxCapacity}</td>
                  <td className="px-4 py-3 text-green-600 font-bold">₹{parseInt(room.monthlyRent || 0).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      room.status === 'Available' ? 'bg-green-100 text-green-800' :
                      room.status === 'Occupied' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(room)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 mr-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
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