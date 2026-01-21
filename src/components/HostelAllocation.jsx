import React, { useState, useEffect } from 'react';
import { showSuccess, showError, showConfirm, showToast } from '../utils/sweetAlert';
import { FaHome } from 'react-icons/fa';

export default function HostelAllocation() {
  const [allocations, setAllocations] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    hostelName: '',
    roomNo: '',
    joiningDate: '',
    monthlyRent: '',
    securityDeposit: '',
    remark: ''
  });

  useEffect(() => {
    const savedAllocations = localStorage.getItem('hostelAllocations');
    const savedHostels = localStorage.getItem('hostels');
    const savedRooms = localStorage.getItem('rooms');
    const savedRoomTypes = localStorage.getItem('roomTypes');
    if (savedAllocations) setAllocations(JSON.parse(savedAllocations));
    if (savedHostels) setHostels(JSON.parse(savedHostels));
    if (savedRooms) setRooms(JSON.parse(savedRooms));
    if (savedRoomTypes) setRoomTypes(JSON.parse(savedRoomTypes));
  }, []);

  const getAvailableRooms = () => {
    return rooms.filter(room => room.hostelName === formData.hostelName && room.status === 'Available');
  };

  // Auto-fill monthly rent and security deposit when room is selected
  useEffect(() => {
    if (formData.roomNo) {
      const selectedRoom = rooms.find(room => 
        room.hostelName === formData.hostelName && room.roomNumber === formData.roomNo
      );
      if (selectedRoom) {
        const roomType = roomTypes.find(rt => rt.roomTypeName === selectedRoom.roomType);
        if (roomType) {
          setFormData(prev => ({
            ...prev,
            monthlyRent: roomType.monthlyRent,
            securityDeposit: roomType.securityDeposit
          }));
        }
      }
    }
  }, [formData.roomNo, formData.hostelName, rooms, roomTypes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allocationData = {
      ...formData,
      id: Date.now(),
      allocationDate: new Date().toLocaleDateString(),
      status: 'Active'
    };
    
    const updatedAllocations = [...allocations, allocationData];
    setAllocations(updatedAllocations);
    localStorage.setItem('hostelAllocations', JSON.stringify(updatedAllocations));
    
    setShowForm(false);
    resetForm();
    await showSuccess('Allocated!', 'Student successfully allocated to hostel room');
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      studentName: '',
      hostelName: '',
      roomNo: '',
      joiningDate: '',
      monthlyRent: '',
      securityDeposit: '',
      remark: ''
    });
  };

  const handleCancelAllocation = async (id) => {
    const result = await showConfirm('Cancel Allocation?', 'This will cancel the student hostel allocation');
    if (result.isConfirmed) {
      const updatedAllocations = allocations.filter(a => a.id !== id);
      setAllocations(updatedAllocations);
      localStorage.setItem('hostelAllocations', JSON.stringify(updatedAllocations));
      showToast('success', 'Allocation cancelled successfully');
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
          <h2 className="text-2xl font-bold text-gray-900">Hostel Allocation</h2>
          <p className="text-gray-600">Allocate students to hostel beds</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 font-bold transition-all duration-300"
        >
          Allocate Student
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white/50 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">Allocate Student to Hostel</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Student ID *</label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Student Name *</label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Hostel Name *</label>
              <select
                value={formData.hostelName}
                onChange={(e) => setFormData({...formData, hostelName: e.target.value, roomNo: '', bedNo: ''})}
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
              <label className="block text-sm font-bold text-gray-700 mb-2">Room No (Vacant only) *</label>
              <select
                value={formData.roomNo}
                onChange={(e) => setFormData({...formData, roomNo: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                required
                disabled={!formData.hostelName}
              >
                <option value="">Select Room</option>
                {getAvailableRooms().map(room => (
                  <option key={room.id} value={room.roomNumber}>{room.roomNumber}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Joining Date *</label>
              <input
                type="date"
                value={formData.joiningDate}
                onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                required
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
              <label className="block text-sm font-bold text-gray-700 mb-2">Security Deposit (Auto)</label>
              <input
                type="number"
                value={formData.securityDeposit}
                className="w-full border-2 border-gray-200 p-3 rounded-xl bg-gray-100"
                disabled
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Remark</label>
              <textarea
                value={formData.remark}
                onChange={(e) => setFormData({...formData, remark: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                rows="2"
              />
            </div>
            
            <div className="md:col-span-2 flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 font-bold"
              >
                Allocate
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

      {/* Allocation List */}
      <div className="bg-white/50 rounded-2xl overflow-hidden">
        <div className="p-4 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Hostel Allocations ({allocations.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Student ID</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Student Name</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Hostel</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Room</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Joining Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Monthly Rent</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((allocation, index) => (
                <tr key={allocation.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="px-4 py-3 font-bold">{allocation.studentId}</td>
                  <td className="px-4 py-3">{allocation.studentName}</td>
                  <td className="px-4 py-3">{allocation.hostelName}</td>
                  <td className="px-4 py-3">{allocation.roomNo}</td>
                  <td className="px-4 py-3">{allocation.joiningDate}</td>
                  <td className="px-4 py-3">₹{allocation.monthlyRent}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleCancelAllocation(allocation.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
                    >
                      Cancel Allocation
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